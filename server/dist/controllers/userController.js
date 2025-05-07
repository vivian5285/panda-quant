"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
class UserController {
    async getAllUsers(_req, res) {
        try {
            const users = await User_1.User.find();
            res.json(users);
        }
        catch (error) {
            logger_1.logger.error('Error getting users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User_1.User.findById(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        }
        catch (error) {
            logger_1.logger.error('Error getting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async register(req, res) {
        try {
            const user = new User_1.User(req.body);
            await user.save();
            res.status(201).json(user);
        }
        catch (error) {
            logger_1.logger.error('Error registering user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User_1.User.findByIdAndUpdate(id, req.body, { new: true });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        }
        catch (error) {
            logger_1.logger.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const success = await User_1.User.findByIdAndDelete(id);
            if (!success) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(204).send({});
        }
        catch (error) {
            logger_1.logger.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map