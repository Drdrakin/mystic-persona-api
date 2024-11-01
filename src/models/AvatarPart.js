import mongoose from 'mongoose';

const AvatarPartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: {type: String, required: false},
  imageUrl: { type: String, required: true }
});

export default mongoose.model('AvatarPart', AvatarPartSchema);
