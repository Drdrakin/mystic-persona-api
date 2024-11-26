import mongoose from 'mongoose';

const AvatarPartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['head', 'body', 'legs', 'accessories', 'glasses', 'hats', 'eyes','mouth'],
  },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
});

AvatarPartSchema.index({ type: 1 });

export default mongoose.model('AvatarPart', AvatarPartSchema);
