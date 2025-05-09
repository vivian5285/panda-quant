"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const user_model_1 = require("../models/user.model");
const logger_1 = require("../utils/logger");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await user_model_1.User.findById(decoded.id);
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        next(error);
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authMiddleware.js.map