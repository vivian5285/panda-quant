import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { User } from '../models/User';
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new UnauthorizedError('No authentication token provided');
        }
        const decoded = jwt.verify(token, config.jwtSecret);
        // 从数据库获取完整的用户信息
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new UnauthorizedError('User not found');
        }
        // 将完整的用户信息添加到请求对象中
        req.user = user;
        next();
    }
    catch (error) {
        next(new UnauthorizedError('Invalid authentication token'));
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new UnauthorizedError('User not authenticated');
        }
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('Insufficient permissions');
        }
        next();
    };
};
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }
    next();
};
export const hasPermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.permissions?.includes(permission)) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    };
};
//# sourceMappingURL=Auth.js.map