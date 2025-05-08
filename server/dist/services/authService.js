"use strict";
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
    constructor() { }
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    convertToIUser(user) {
        const userObj = user.toObject();
        return {
            ...userObj,
            id: userObj._id.toString(),
            _id: userObj._id,
            isActive: userObj.isActive ?? true
        };
    }
    async register(data) {
        try {
            const existingUser = await User_1.User.findOne({ email: data.email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
            const user = new User_1.User({
                email: data.email,
                password: hashedPassword,
                username: data.username,
                isActive: true
            });
            await user.save();
            const { token } = this.generateToken(user);
            return {
                user: user,
                token: token,
                refreshToken: token
            };
        }
        catch (error) {
            logger_1.logger.error('Error in register:', error);
            throw error;
        }
    }
    async login(credentials) {
        try {
            const user = await User_1.User.findOne({ email: credentials.email });
            if (!user) {
                throw new Error('User not found');
            }
            const isValidPassword = await bcryptjs_1.default.compare(credentials.password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }
            const { token } = this.generateToken(user);
            return {
                user: user,
                token: token,
                refreshToken: token
            };
        }
        catch (error) {
            logger_1.logger.error('Error in login:', error);
            throw error;
        }
    }
    async logout(userId) {
        try {
            // In a real application, you might want to invalidate the token here
            // For now, we'll just log the logout
            logger_1.logger.info(`User ${userId} logged out`);
        }
        catch (error) {
            logger_1.logger.error('Logout error:', error);
            throw error;
        }
    }
    async getCurrentUser(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return this.convertToIUser(user);
        }
        catch (error) {
            logger_1.logger.error('Get current user error:', error);
            throw error;
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env['JWT_SECRET'] || 'your-secret-key');
            const user = await User_1.User.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            const newToken = this.generateToken(user);
            return newToken;
        }
        catch (error) {
            logger_1.logger.error('Refresh token error:', error);
            throw new Error('Invalid refresh token');
        }
    }
    async updateUser(userId, updateData) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Update only allowed fields
            if (updateData.name) {
                user.name = updateData.name;
            }
            if (updateData.email) {
                user.email = updateData.email;
            }
            await user.save();
            return this.convertToIUser(user);
        }
        catch (error) {
            logger_1.logger.error('Update user error:', error);
            throw error;
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
        }
        catch (error) {
            logger_1.logger.error('Change password error:', error);
            throw error;
        }
    }
    generateToken(user) {
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        return {
            token,
            expiresIn: 24 * 60 * 60 // 24 hours in seconds
        };
    }
    async resetPassword(data) {
        try {
            const user = await User_1.User.findOne({ resetToken: data.token });
            if (!user) {
                throw new Error('Invalid reset token');
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.newPassword, 10);
            user.password = hashedPassword;
            user.resetToken = undefined;
            await user.save();
        }
        catch (error) {
            logger_1.logger.error('Error in resetPassword:', error);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map