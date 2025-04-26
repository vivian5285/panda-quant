"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../models/user.model");
const errors_1 = require("../utils/errors");
class UserRepository {
    static async create(userData) {
        try {
            const user = new user_model_1.UserModel(userData);
            return await user.save();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to create user', error);
        }
    }
    static async findByEmail(email) {
        try {
            return await user_model_1.UserModel.findOne({ email });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to find user by email', error);
        }
    }
    static async findById(id) {
        try {
            return await user_model_1.UserModel.findById(id);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to find user by id', error);
        }
    }
    static async update(id, userData) {
        try {
            return await user_model_1.UserModel.findByIdAndUpdate(id, { $set: userData }, { new: true, runValidators: true });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to update user', error);
        }
    }
    static async delete(id) {
        try {
            const result = await user_model_1.UserModel.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to delete user', error);
        }
    }
    static async findAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [users, total] = await Promise.all([
                user_model_1.UserModel.find().skip(skip).limit(limit).select('-password'),
                user_model_1.UserModel.countDocuments()
            ]);
            return { users, total };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to find users', error);
        }
    }
}
exports.UserRepository = UserRepository;
