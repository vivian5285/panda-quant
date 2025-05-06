import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key');
        req.user = { _id: decoded.id, email: decoded.email };
        next();
    }
    catch (error) {
        logger.error('Token verification failed:', error);
        res.status(403).json({ message: 'Invalid token' });
    }
};
//# sourceMappingURL=auth.middleware.js.map