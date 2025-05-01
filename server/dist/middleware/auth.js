"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
const authenticate = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Convert Mongoose document to plain object and ensure _id is ObjectId
        const userObject = user.toObject();
        const userId = user._id;
        req.user = {
            ...userObject,
            _id: userId,
            id: userId.toString(),
            isAdmin: userObject.role === 'admin'
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const isAdmin = (req, res, next) => {
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
exports.isAdmin = isAdmin;
const hasPermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.permissions.includes(permission)) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    };
};
exports.hasPermission = hasPermission;
//# sourceMappingURL=auth.js.map