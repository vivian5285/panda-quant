"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../utils/errors");
class UserService {
    constructor() {
        this.userModel = User_1.User;
    }
    async getUserByEmail(email) {
        try {
            return await this.userModel.findOne({ email });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to get user by email', error);
        }
    }
    async createUser(userData) {
        try {
            if (userData.password) {
                const salt = await bcrypt_1.default.genSalt(10);
                userData.password = await bcrypt_1.default.hash(userData.password, salt);
            }
            const user = new this.userModel(userData);
            return await user.save();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to create user', error);
        }
    }
    async updateUser(id, userData) {
        try {
            return await this.userModel.findByIdAndUpdate(id, { $set: userData }, { new: true, runValidators: true });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to update user', error);
        }
    }
    async verifyEmail(email) {
        try {
            return await this.userModel.findOneAndUpdate({ email }, { $set: { isEmailVerified: true } }, { new: true });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error verifying email');
        }
    }
    async comparePassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    async validateUser(email, password) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user)
                return null;
            const isValid = await bcrypt_1.default.compare(password, user.password);
            return isValid ? user : null;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to validate user', error);
        }
    }
    async deleteUser(id) {
        try {
            const result = await this.userModel.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to delete user', error);
        }
    }
    async getUserById(id) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }
    async getAllUsers(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const users = await this.userModel.find().skip(skip).limit(limit);
            const total = await this.userModel.countDocuments();
            return { users, total };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to get users', error);
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map