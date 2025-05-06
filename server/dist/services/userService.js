"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../utils/logger");
class UserService {
    constructor() { }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    convertToIUser(user) {
        if (!user)
            return null;
        return {
            ...user.toObject(),
            _id: user._id
        };
    }
    async authenticate(email, password) {
        try {
            const user = await User_1.User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const isValid = await bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }
            const convertedUser = this.convertToIUser(user);
            if (!convertedUser) {
                throw new Error('Failed to convert user');
            }
            // TODO: Generate JWT token
            const token = 'dummy-token';
            return { user: convertedUser, token };
        }
        catch (error) {
            logger_1.logger.error('Authentication error:', error);
            throw error;
        }
    }
    async createUser(data) {
        const user = new User_1.User({
            ...data,
            _id: new mongoose_1.Types.ObjectId(),
            name: data.name || '',
            level: data.level || 1,
            role: data.role || 'user',
            status: data.status || 'active',
            permissions: data.permissions || []
        });
        const savedUser = await user.save();
        const convertedUser = this.convertToIUser(savedUser);
        if (!convertedUser) {
            throw new Error('Failed to create user');
        }
        return convertedUser;
    }
    async getUserById(id) {
        const user = await User_1.User.findById(id);
        return this.convertToIUser(user);
    }
    async updateUser(id, data) {
        const user = await User_1.User.findByIdAndUpdate(id, data, { new: true });
        return this.convertToIUser(user);
    }
    async deleteUser(id) {
        const result = await User_1.User.findByIdAndDelete(id);
        return result !== null;
    }
    async getUserByEmail(email) {
        const user = await User_1.User.findOne({ email });
        return this.convertToIUser(user);
    }
    async getUserByUsername(username) {
        const user = await User_1.User.findOne({ username });
        return this.convertToIUser(user);
    }
    async getUsers() {
        const users = await User_1.User.find();
        return users.map(user => this.convertToIUser(user)).filter((user) => user !== null);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map