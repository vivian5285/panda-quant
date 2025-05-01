"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../models/User");
const errors_1 = require("../utils/errors");
class UserRepository {
    static async create(userData) {
        try {
            const user = new User_1.User(userData);
            return await user.save();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to create user', error);
        }
    }
    static async findByEmail(email) {
        try {
            return await User_1.User.findOne({ email });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to find user by email', error);
        }
    }
    static async findById(id) {
        try {
            return await User_1.User.findById(id);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to find user by id', error);
        }
    }
    static async update(id, userData) {
        try {
            return await User_1.User.findByIdAndUpdate(id, { $set: userData }, { new: true, runValidators: true });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to update user', error);
        }
    }
    static async delete(id) {
        try {
            const result = await User_1.User.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to delete user', error);
        }
    }
    static async findAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const users = await User_1.User.find().skip(skip).limit(limit);
            const total = await User_1.User.countDocuments();
            return { users, total };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to find users', error);
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map