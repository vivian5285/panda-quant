"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.isAdmin = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const User_1 = require("../models/User");
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new errors_1.UnauthorizedError('No authentication token provided');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        // 从数据库获取完整的用户信息
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        // 将完整的用户信息添加到请求对象中
        req.user = user;
        next();
    }
    catch (error) {
        next(new errors_1.UnauthorizedError('Invalid authentication token'));
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new errors_1.UnauthorizedError('User not authenticated');
        }
        if (!roles.includes(req.user.role)) {
            throw new errors_1.ForbiddenError('Insufficient permissions');
        }
        next();
    };
};
exports.authorize = authorize;
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
        if (!req.user || !req.user.permissions?.includes(permission)) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    };
};
exports.hasPermission = hasPermission;
//# sourceMappingURL=Auth.js.map