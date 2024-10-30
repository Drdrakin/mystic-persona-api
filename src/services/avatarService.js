import AvatarPart from '../models/AvatarPart.js';
import { generateSignedUrl } from '../utils/googleCloudStorage.js';

async function getAvatarParts() {
  try {
    const parts = await AvatarPart.find();
    const partsWithUrls = await Promise.all(parts.map(async (part) => {
      part.imageUrl = await generateSignedUrl(part.imageUrl);
      return part;
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
    throw new Error('Error creating avatar part');
  }
}

async function updateAvatarPart(id, data) {
  try {
    return await AvatarPart.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    throw new Error('Error updating avatar part');
  }
}

async function deleteAvatarPart(id) {
  try {
    return await AvatarPart.findByIdAndDelete(id);
  } catch (err) {
    throw new Error('Error deleting avatar part');
  }
}

async function getCategories() {
  try {
      const categories = await AvatarPart.distinct('type');
      return categories;
  } catch (err) {
      throw new Error('Error retrieving categories');
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
    throw new Error('Error retrieving components');
  }
}

export default { getAvatarParts, createAvatarPart, updateAvatarPart, deleteAvatarPart, getCategories, getComponentsByCategory };
