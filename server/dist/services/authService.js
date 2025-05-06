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
exports.AuthService = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../utils/logger");
class AuthService {
    convertToIUser(user) {
        const userObj = user.toObject ? user.toObject() : user;
        return Object.assign(Object.assign({}, userObj), { id: userObj._id.toString(), _id: userObj._id });
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield User_1.User.findOne({ email: userData.email });
                if (existingUser) {
                    throw new Error('User already exists');
                }
                const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
                const user = yield User_1.User.create(Object.assign(Object.assign({}, userData), { password: hashedPassword, username: userData.email.split('@')[0], level: 1, role: 'user', status: 'active', permissions: [] }));
                return this.convertToIUser(user);
            }
            catch (error) {
                logger_1.logger.error('Registration error:', error);
                throw error;
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne({ email });
                if (!user) {
                    throw new Error('Invalid credentials');
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid credentials');
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env['JWT_SECRET'] || 'your-secret-key', { expiresIn: '24h' });
                return {
                    token,
                    expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
                };
            }
            catch (error) {
                logger_1.logger.error('Login error:', error);
                throw error;
            }
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real application, you might want to invalidate the token here
                // For now, we'll just log the logout
                logger_1.logger.info(`User ${userId} logged out`);
            }
            catch (error) {
                logger_1.logger.error('Logout error:', error);
                throw error;
            }
        });
    }
    getCurrentUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                return this.convertToIUser(user);
            }
            catch (error) {
                logger_1.logger.error('Get current user error:', error);
                throw error;
            }
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env['JWT_SECRET'] || 'your-secret-key');
                const user = yield User_1.User.findById(decoded.id);
                if (!user) {
                    throw new Error('User not found');
                }
                const newToken = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env['JWT_SECRET'] || 'your-secret-key', { expiresIn: '24h' });
                return {
                    token: newToken,
                    expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
                };
            }
            catch (error) {
                logger_1.logger.error('Refresh token error:', error);
                throw new Error('Invalid refresh token');
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map