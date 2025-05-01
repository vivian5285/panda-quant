"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const errorHandler_1 = require("../utils/errorHandler");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
const User_1 = require("../models/User");
class UserController {
    constructor() {
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.userService.authenticate(email, password);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Login error:', error);
                res.status(401).json({ message: 'Invalid credentials' });
            }
        };
        this.register = async (req, res) => {
            try {
                const user = await this.userService.createUser(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                logger_1.logger.error('Registration error:', error);
                res.status(400).json({ message: 'Registration failed' });
            }
        };
        this.getUserProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const user = await this.userService.getUserById(req.user._id.toString());
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                logger_1.logger.error('Error getting user profile:', error);
                res.status(500).json({ message: 'Error getting user profile', error: error.message });
            }
        };
        this.updateUserProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const userData = req.body;
                const updatedUser = await this.userService.updateUser(req.user._id.toString(), userData);
                if (!updatedUser) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.json(updatedUser);
            }
            catch (error) {
                logger_1.logger.error('Error updating user profile:', error);
                res.status(500).json({ message: 'Error updating user profile', error: error.message });
            }
        };
        this.userService = UserService_1.UserService.getInstance();
    }
    checkAuth(req) {
        if (!req.user) {
            throw new Error('Unauthorized');
        }
    }
    async getAllUsers(_req, res) {
        try {
            const users = await this.userService.getUsers();
            res.json(users);
        }
        catch (error) {
            logger_1.logger.error('Error getting users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await this.userService.getUserById(req.params['id']);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json({ ...user, password: undefined });
        }
        catch (error) {
            logger_1.logger.error('Error getting user:', error);
            res.status(500).json({ message: 'Error getting user' });
        }
    }
    async updateUser(req, res) {
        try {
            const user = await this.userService.updateUser(req.params['id'], req.body);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json({ ...user, password: undefined });
        }
        catch (error) {
            logger_1.logger.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user' });
        }
    }
    async updateUserStatus(req, res) {
        try {
            const { status } = req.body;
            if (!status) {
                res.status(400).json({ message: 'Status is required' });
                return;
            }
            const user = await this.userService.updateUser(req.params['id'], { status });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json({ ...user, password: undefined });
        }
        catch (error) {
            logger_1.logger.error('Error updating user status:', error);
            res.status(500).json({ message: 'Error updating user status' });
        }
    }
    async deleteUser(req, res) {
        try {
            const success = await this.userService.deleteUser(req.params['id']);
            if (!success) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error deleting user:', error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    }
    async getProfile(req, res) {
        var _a;
        try {
            this.checkAuth(req);
            const user = await this.userService.getUserById(((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '');
            res.json(user);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async updateProfile(req, res) {
        var _a;
        try {
            this.checkAuth(req);
            const user = await this.userService.updateUser(((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '', req.body);
            res.json(user);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async changePassword(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            const { oldPassword, newPassword } = req.body;
            const user = await User_1.User.findById(req.user._id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const isPasswordValid = await user.comparePassword(oldPassword);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid password' });
                return;
            }
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password changed successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error changing password:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            res.json(user);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                logger_1.logger.error('Error getting user:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}
exports.UserController = UserController;
exports.default = new UserController();
//# sourceMappingURL=userController.js.map