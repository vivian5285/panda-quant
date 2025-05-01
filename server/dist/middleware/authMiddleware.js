"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const authMiddleware = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env['JWT_SECRET'] || 'your-secret-key');
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Convert Mongoose document to plain object and ensure all required fields are present
        const userObj = user.toObject();
        const userId = user._id;
        // Create a new object with all required fields
        const userData = {
            _id: userId,
            id: userId.toString(),
            email: userObj.email,
            password: userObj.password,
            username: userObj.username,
            name: userObj.name || '',
            level: userObj.level || 1,
            role: userObj.role || 'user',
            status: userObj.status || 'active',
            permissions: userObj.permissions || [],
            isAdmin: userObj.role === 'admin',
            createdAt: userObj.createdAt,
            updatedAt: userObj.updatedAt
        };
        req.user = userData;
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map