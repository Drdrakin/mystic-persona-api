import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '72h' });
}
