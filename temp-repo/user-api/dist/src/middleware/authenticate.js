"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new errors_1.AuthError('No token provided');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new errors_1.AuthError('Invalid token format');
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid token'
            });
        }
        else if (error instanceof errors_1.AuthError) {
            res.status(401).json({
                status: 'error',
                message: error.message
            });
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};
exports.authenticate = authenticate;
