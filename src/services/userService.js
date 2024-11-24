import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';

async function createUser(firstName, lastName, birthday, email, password) {
    try {
        const user = new User({
            firstName,
            lastName,
            birthday,
            email,
            password,
        });

        await user.save();
        console.log("User successfully created!");
    } catch (error) {
        throw new Error(error);
    }
}

async function login(email, password) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found.");
        }

        if (password !== user.password) {
            throw new Error("Incorrect password.");
        }

        const token = generateToken(user);

        console.log("Login successful");
        return token;
    } catch (error) {
        throw new Error(error);
    }
}

export default { createUser, login };
