import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Convert Mongoose document to plain object and ensure all required fields are present
        const userObj = user.toObject();
        const userId = user._id;
        // Create a new object with all required fields
        req.user = user;
        next();
    }
    catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
//# sourceMappingURL=authMiddleware.js.map