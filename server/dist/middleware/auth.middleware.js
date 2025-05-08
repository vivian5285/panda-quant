"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const User_1 = __importDefault(require("../models/User"));
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env['JWT_SECRET'] || 'your-secret-key');
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            res.status(403).json({ message: 'User not found' });
            return;
        }
        const authReq = req;
        authReq.user = user;
        next();
    }
    catch (error) {
        logger_1.logger.error('Token verification failed:', error);
        res.status(403).json({ message: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.middleware.js.map