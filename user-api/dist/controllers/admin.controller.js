"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_model_1 = require("../models/user.model");
const errors_1 = require("../utils/errors");
class AdminController {
    static async getUsers(req, res) {
        try {
            const users = await user_model_1.UserModel.find({}, '-password');
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const user = await user_model_1.UserModel.findByIdAndUpdate(id, { $set: userData }, { new: true, runValidators: true }).select('-password');
            if (!user) {
                throw new errors_1.ValidationError('User not found');
            }
            res.json(user);
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Failed to update user' });
            }
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await user_model_1.UserModel.findByIdAndDelete(id);
            if (!user) {
                throw new errors_1.ValidationError('User not found');
            }
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Failed to delete user' });
            }
        }
    }
}
exports.AdminController = AdminController;
