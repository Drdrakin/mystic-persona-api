import mongoose from 'mongoose';

const UserAvatarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  avatarParts: [
    {
      part: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AvatarPart', 
        required: true 
      },
      position: { type: String },
      color: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserAvatarSchema.index({ userId: 1 });

export default mongoose.model('UserAvatar', UserAvatarSchema);
