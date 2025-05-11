"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.hasPermission = exports.isAdmin = exports.authorize = exports.ensureAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const user_model_1 = require("../models/user.model");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
// 通用的错误处理函数
const handleAuthError = (error, res) => {
    logger_1.logger.error('Authentication error:', error);
    if (error instanceof errors_1.UnauthorizedError) {
        res.status(401).json({ error: error.message });
    }
    else if (error instanceof errors_1.ForbiddenError) {
        res.status(403).json({ error: error.message });
    }
    else {
        res.status(403).json({ error: 'Authorization failed' });
    }
};
const ensureAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        if (!decoded) {
            throw new errors_1.UnauthorizedError('Invalid token');
        }
        const user = await user_model_1.User.findById(decoded.id);
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
exports.ensureAuthenticated = ensureAuthenticated;
const authorize = (role) => async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Authentication required');
        }
        if (req.user.role !== role) {
            throw new errors_1.ForbiddenError('Insufficient permissions');
        }
        next();
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
exports.authorize = authorize;
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Not authenticated');
        }
        if (req.user.role !== 'admin') {
            throw new errors_1.ForbiddenError('Not authorized');
        }
        next();
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
exports.isAdmin = isAdmin;
const hasPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError('Not authenticated');
            }
            if (!req.user.permissions?.includes(permission)) {
                throw new errors_1.ForbiddenError('Access denied');
            }
            next();
        }
        catch (error) {
            handleAuthError(error, res);
        }
    };
};
exports.hasPermission = hasPermission;
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new errors_1.UnauthorizedError('Authentication token is required');
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await user_model_1.User.findById(decoded.id);
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=Auth.js.map