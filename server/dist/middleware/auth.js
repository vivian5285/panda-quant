"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new errors_1.UnauthorizedError('No authentication token provided');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        // 从数据库获取完整的用户信息
        const user = yield User_1.User.findById(decoded.userId);
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
});
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
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!req.user || !((_a = req.user.permissions) === null || _a === void 0 ? void 0 : _a.includes(permission))) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    });
};
exports.hasPermission = hasPermission;
//# sourceMappingURL=Auth.js.map