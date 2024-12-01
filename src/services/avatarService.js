import AvatarPart from '../models/AvatarPart.js';
import UserAvatar from '../models/UserAvatar.js';
import GCP from '../utils/googleCloudStorage.js';
import { composeAvatar } from '../utils/imageProcessing.js';
import axios from 'axios';
import mongoose from 'mongoose'; 

// todo for v2: build this again from scratch. I found several limitations in using static images for composing a complete one,
// mainly the lack of a grid, and proper coordinates to align componentes in a scalabe format. Also, heavy server processing cost, 
// what if there are hundrends of components? A problem surges.
//
// hypothesis: leverage the canvas html element for processing the element client-side, and process only the positions + the single
// resulting image, that way I would have an actual grid with coordinates, and would be possible to process tens of componentes per avatar
// due to integer coordinates being much lightweight than actual buffer binary data.
// Instead of canvas, it could be the 'p5' client-side npm library, which seems to be more refined and easier to implement on top of.


async function createUserAvatar(data) {
  try {
    const head = data.avatarParts[0];
    const eyes = data.avatarParts[1];
    const mouth = data.avatarParts[2];
    const userId = new mongoose.Types.ObjectId(data.userId);

    // Step 1: Fetch MongoDB data
    const headPart = await AvatarPart.findById(head);
    const eyesPart = await AvatarPart.findById(eyes);
    const mouthPart = await AvatarPart.findById(mouth);
    console.log("Parts data fetched:", headPart, eyesPart, mouthPart);

    if (!headPart || !eyesPart || !mouthPart) {
      throw new Error('One or more avatar parts not found');
    }

    // Step 2: Generate signed URLs for the images
    const headSignedUrl = await GCP.generateSignedUrl(headPart.imageUrl);
    const eyesSignedUrl = await GCP.generateSignedUrl(eyesPart.imageUrl);
    const mouthSignedUrl = await GCP.generateSignedUrl(mouthPart.imageUrl);
    console.log("Signed URLs generated");

    // Step 3: Download images from signed URLs
    const headBuffer = await downloadImageFromUrl(headSignedUrl);
    const eyesBuffer = await downloadImageFromUrl(eyesSignedUrl);
    const mouthBuffer = await downloadImageFromUrl(mouthSignedUrl);
    console.log("Parts images fetched");

    // Step 4: Compose avatar
    const composedAvatarBuffer = await composeAvatar({
      head: headBuffer,
      eyes: eyesBuffer,
      mouth: mouthBuffer
    });

    // Step 5: Upload the composed avatar
    const timestamp = Date.now();
    const composedAvatarFilename = await GCP.uploadImage({
      buffer: composedAvatarBuffer,
      originalname: `avatar_${userId}_${timestamp}.png`
    });

    // Step 6: Generate a signed URL for the uploaded avatar
    const avatarUrl = await GCP.generateSignedUrl(composedAvatarFilename);

    // Step 7: Prepare and save the metadata to MongoDB
    return saveAvatarMetadata(userId, data.avatarParts, avatarUrl);
  } catch (err) {
    console.error('Error creating user avatar:', err);
    throw new Error('Error creating user avatar: ' + err.message);
  }
}

async function getAvatarParts() {
  try {
    const parts = await AvatarPart.find();
    const partsWithUrls = await Promise.all(parts.map(async (part) => {
      const signedUrl = await GCP.generateSignedUrl(part.imageUrl);
      return { ...part._doc, imageUrl: signedUrl };
    }));
    return partsWithUrls;
  } catch (err) {
    throw new Error('Error retrieving avatar parts');
  }
}

async function createAvatarPart(data) {
  try {
    const newPart = new AvatarPart(data);
    return await newPart.save();
  } catch (err) {
    throw new Error("Error creating avatar part" + err);
  }
}

async function updateAvatarPart(id, data) {
  try {
    return await AvatarPart.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    throw new Error('Error updating avatar part' + err);
  }
}

async function deleteAvatarPart(id) {
  try {
    return await AvatarPart.findByIdAndDelete(id);
  } catch (err) {
    throw new Error('Error deleting avatar part' + err);
  }
}

async function getCategories() {
  try {
      const categories = await AvatarPart.distinct('type');
      return categories;
  } catch (err) {
      throw new Error('Error retrieving categories' + err);
  }
}

async function getComponentsByCategory(category) {
  try {
    const components = await AvatarPart.find({ type: category });
    const componentsWithSignedUrls = await Promise.all(components.map(async (component) => {
      const signedUrl = await GCP.generateSignedUrl(component.imageUrl);
      return { ...component._doc, imageUrl: signedUrl };
    }));
    return componentsWithSignedUrls;
  } catch (err) {
    throw new Error('Error retrieving components' + err);
  }
}

// Gambiarra, but it works for now, not scalable and escapes the pattern, 
// todo: delete this 
async function downloadImageFromUrl(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error('Failed to download image from URL: ' + error.message);
  }
}

async function saveAvatarMetadata(userId, avatarParts, avatarUrl) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const formattedParts = avatarParts.map(part => ({
      part: new mongoose.Types.ObjectId(part.part),
      position: part.position || '',
      color: part.color || ''
    }));

    const savedAvatar = await UserAvatar.create({
      userId: objectId,
      avatarParts: formattedParts,
      imageUrl: avatarUrl,
      createdAt: new Date()
    });

    console.log("Saved to mongodb\n");
    console.log("Success!");

    return { link: avatarUrl, savedAvatar: savedAvatar };
  } catch (err) {
    console.error('Error saving avatar metadata:', err);
    throw new Error('Error saving avatar metadata: ' + err.message);
  }
}

async function getUserAvatars(userId) {

  try {
    const userAvatars = await UserAvatar.find({ userId });

    return userAvatars;
  } catch (err) {
    console.error(`Error retrieving avatars for user ${userId}:`, err);
    throw new Error(`Error retrieving avatars for user ${userId}`);
  }
}

export default { getAvatarParts, createAvatarPart, updateAvatarPart, deleteAvatarPart, getCategories, getComponentsByCategory, createUserAvatar, getUserAvatars };