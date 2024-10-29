import AvatarPart from '../models/AvatarPart.js';

async function getAvatarParts() {
  try {
    return await AvatarPart.find();
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

export default { getAvatarParts, createAvatarPart, updateAvatarPart, deleteAvatarPart };
