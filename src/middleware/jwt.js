import jwt from 'jsonwebtoken'

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    try {
        // Verify the token
        const secret = process.env.JWT_SECRET || 'default_secret_key';
        const decoded = jwt.verify(token, secret);

        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token!' });
    }
};

export default jwtMiddleware;