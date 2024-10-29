import mongoose from 'mongoose';

const AvatarPartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

export default mongoose.model('AvatarPart', AvatarPartSchema);
