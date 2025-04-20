"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../utils/errors");
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    constructor() {
        this.userModel = user_model_1.UserModel;
    }
    async getUserByEmail(email) {
        try {
            return await this.userModel.findOne({ email });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding user by email');
        }
    }
    async createUser(userData) {
        try {
            // Hash password before saving
            if (userData.password) {
                const salt = await bcrypt_1.default.genSalt(10);
                userData.password = await bcrypt_1.default.hash(userData.password, salt);
            }
            const user = new this.userModel(userData);
            return await user.save();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error creating user');
        }
    }
    async updateUser(id, updateData) {
        try {
            return await this.userModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating user');
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
    static async validateUser(email, password) {
        try {
            const user = await user_repository_1.UserRepository.findByEmail(email);
            if (!user)
                return null;
            const isValid = await bcrypt_1.default.compare(password, user.password);
            return isValid ? user : null;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to validate user', error);
        }
    }
    static async deleteUser(id) {
        try {
            return await user_repository_1.UserRepository.delete(id);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to delete user', error);
        }
    }
    static async getUserById(id) {
        try {
            return await user_repository_1.UserRepository.findById(id);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to get user', error);
        }
    }
    static async getAllUsers(page = 1, limit = 10) {
        try {
            return await user_repository_1.UserRepository.findAll(page, limit);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to get users', error);
        }
    }
}
exports.UserService = UserService;
