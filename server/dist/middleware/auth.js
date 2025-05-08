"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.hasPermission = exports.isAdmin = exports.authorize = exports.ensureAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
const ensureAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        if (!decoded) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        req.user = { _id: decoded.id };
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
exports.ensureAuthenticated = ensureAuthenticated;
const authorize = (role) => async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Authorization error:', error);
        res.status(403).json({ error: 'Authorization failed' });
    }
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
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.logger.error('Error authenticating token:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map