import AvatarPart from '../models/AvatarPart.js';

const validateAvatarParts = async (req, res, next)  => {
        const { avatarParts } = req.body;
    try {
        const partIds = avatarParts.map(part => part.part);
        const validParts = await AvatarPart.find({ _id: { $in: partIds } });
    if (validParts.length !== avatarParts.length) {
        return res.status(400).json({ message: 'Some avatar parts are invalid.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error validating avatar parts', error: err });
  }
}

export default validateAvatarParts;