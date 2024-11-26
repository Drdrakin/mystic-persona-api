import AvatarPart from '../models/AvatarPart.js';
import Avatar from '../models/Avatar.js'
import { uploadImage } from '../utils/googleCloudStorage.js';
import { generateSignedUrl, getImageFromCloud } from '../utils/googleCloudStorage.js';
import { checkCacheAndCompose, composeAvatar } from '../utils/imageProcessing.js';

async function getAvatarParts() {
  try {
    const parts = await AvatarPart.find();
    const partsWithUrls = await Promise.all(parts.map(async (part) => {
      const signedUrl = await generateSignedUrl(part.imageUrl);
      return { ...part._doc, imageUrl: signedUrl };
    }));
    return partsWithUrls;
  } catch (err) {
    throw new Error('Error retrieving avatar parts');
  }
}

async function createUserAvatar(data) {
  try {
    const { head, eyes, mouth } = data;

    //static data to test it
    const headFilename = await uploadImage({ buffer: head, originalname: 'head.png' });
    const eyesFilename = await uploadImage({ buffer: eyes, originalname: 'eyes.png' });
    const mouthFilename = await uploadImage({ buffer: mouth, originalname: 'mouth.png' });

    const composedAvatarBuffer = await composeAvatar({ head: headFilename, eyes: eyesFilename, mouth: mouthFilename });

    // Upload avatar to gcp
    const composedAvatarFilename = await uploadImage({ buffer: composedAvatarBuffer, originalname: 'avatar.png' });

    // return verified (temporary) public url
    const avatarUrl = await generateSignedUrl(composedAvatarFilename);
    const savedAvatar = await Avatar.create({ ...data, imageUrl: avatarUrl });

    return savedAvatar;
  } catch (err) {
    throw new Error("Error creating user avatar: " + err.message);
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
      const signedUrl = await generateSignedUrl(component.imageUrl);
      return { ...component._doc, imageUrl: signedUrl };
    }));
    return componentsWithSignedUrls;
  } catch (err) {
    throw new Error('Error retrieving components' + err);
  }
}

export default { getAvatarParts, createAvatarPart, updateAvatarPart, deleteAvatarPart, getCategories, getComponentsByCategory, createUserAvatar };