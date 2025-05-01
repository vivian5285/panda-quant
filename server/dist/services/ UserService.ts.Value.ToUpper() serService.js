"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
class UserService {
    constructor() { }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    async getAllUsers() {
        try {
            const users = await User_1.User.find().select('-password').lean();
            return users.map(user => ({
                _id: user._id,
                email: user.email,
                username: user.username || '',
                name: user.name || '',
                level: user.level || 1,
                role: user.role || 'user',
                status: user.status || 'active',
                permissions: user.permissions || [],
                referrerId: user.referrerId,
                isAdmin: user.isAdmin || false,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
        }
        catch (error) {
            logger_1.logger.error('Error getting all users:', error);
            throw error;
        }
    }
    async createUser(data) {
        try {
            const hashedPassword = await bcrypt_1.default.hash(data.password || '', 10);
            const user = new User_1.User({
                ...data,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const savedUser = await user.save();
            const userObj = savedUser.toObject();
            return {
                _id: userObj._id,
                email: userObj.email,
                username: userObj.username || '',
                name: userObj.name || '',
                level: userObj.level || 1,
                role: userObj.role || 'user',
                status: userObj.status || 'active',
                permissions: userObj.permissions || [],
                referrerId: userObj.referrerId,
                isAdmin: userObj.isAdmin || false,
                createdAt: userObj.createdAt,
                updatedAt: userObj.updatedAt
            };
        }
        catch (error) {
            logger_1.logger.error('Error creating user:', error);
            throw error;
        }
    }
    async updateUser(id, data) {
        try {
            if (data.password) {
                data.password = await bcrypt_1.default.hash(data.password, 10);
            }
            const updatedUser = await User_1.User.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true }).lean();
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return {
                _id: updatedUser._id,
                email: updatedUser.email,
                username: updatedUser.username || '',
                name: updatedUser.name || '',
                level: updatedUser.level || 1,
                role: updatedUser.role || 'user',
                status: updatedUser.status || 'active',
                permissions: updatedUser.permissions || [],
                referrerId: updatedUser.referrerId,
                isAdmin: updatedUser.isAdmin || false,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        }
        catch (error) {
            logger_1.logger.error('Error updating user:', error);
            throw error;
        }
    }
    async deleteUser(id) {
        try {
            const deletedUser = await User_1.User.findByIdAndDelete(id).lean();
            if (!deletedUser) {
                throw new Error('User not found');
            }
            return {
                _id: deletedUser._id,
                email: deletedUser.email,
                username: deletedUser.username || '',
                name: deletedUser.name || '',
                level: deletedUser.level || 1,
                role: deletedUser.role || 'user',
                status: deletedUser.status || 'active',
                permissions: deletedUser.permissions || [],
                referrerId: deletedUser.referrerId,
                isAdmin: deletedUser.isAdmin || false,
                createdAt: deletedUser.createdAt,
                updatedAt: deletedUser.updatedAt
            };
        }
        catch (error) {
            logger_1.logger.error('Error deleting user:', error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const user = await User_1.User.findById(id).select('-password').lean();
            if (!user) {
                throw new Error('User not found');
            }
            return {
                _id: user._id,
                email: user.email,
                username: user.username || '',
                name: user.name || '',
                level: user.level || 1,
                role: user.role || 'user',
                status: user.status || 'active',
                permissions: user.permissions || [],
                referrerId: user.referrerId,
                isAdmin: user.isAdmin || false,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        }
        catch (error) {
            logger_1.logger.error('Error getting user by id:', error);
            throw error;
        }
    }
    async login(email, password) {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env['JWT_SECRET'] || 'your-secret-key', { expiresIn: '24h' });
        return token;
    }
    async register(email, password, username) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new User_1.User({
            email,
            password: hashedPassword,
            username,
            name: username,
            level: 1,
            role: 'user',
            status: 'active',
            permissions: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const savedUser = await user.save();
        const userObj = savedUser.toObject();
        return {
            _id: userObj._id,
            email: userObj.email,
            username: userObj.username || '',
            name: userObj.name || '',
            level: userObj.level || 1,
            role: userObj.role || 'user',
            status: userObj.status || 'active',
            permissions: userObj.permissions || [],
            referrerId: userObj.referrerId,
            isAdmin: userObj.isAdmin || false,
            createdAt: userObj.createdAt,
            updatedAt: userObj.updatedAt
        };
    }
    async getProfile(userId) {
        const user = await User_1.User.findById(userId).select('-password').lean();
        if (!user) {
            throw new Error('User not found');
        }
        return {
            _id: user._id,
            email: user.email,
            username: user.username || '',
            name: user.name || '',
            level: user.level || 1,
            role: user.role || 'user',
            status: user.status || 'active',
            permissions: user.permissions || [],
            referrerId: user.referrerId,
            isAdmin: user.isAdmin || false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
    async updateProfile(userId, data) {
        const user = await User_1.User.findByIdAndUpdate(userId, { ...data, updatedAt: new Date() }, { new: true }).select('-password').lean();
        if (!user) {
            throw new Error('User not found');
        }
        return {
            _id: user._id,
            email: user.email,
            username: user.username || '',
            name: user.name || '',
            level: user.level || 1,
            role: user.role || 'user',
            status: user.status || 'active',
            permissions: user.permissions || [],
            referrerId: user.referrerId,
            isAdmin: user.isAdmin || false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await User_1.User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.updatedAt = new Date();
        await user.save();
    }
}
exports.UserService = UserService;
//# sourceMappingURL=%20UserService.ts.Value.ToUpper()%20serService.js.map