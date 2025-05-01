"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const logger_1 = require("../utils/logger");
class UserController {
    constructor() {
        this.getProfile = async (req, res) => {
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
                logger_1.logger.error('Error getting profile:', error);
                res.status(500).json({ message: 'Error getting profile', error });
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const user = await this.userService.updateUser(req.user._id.toString(), req.body);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                logger_1.logger.error('Error updating profile:', error);
                res.status(500).json({ message: 'Error updating profile', error });
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                await this.userService.deleteUser(req.user._id.toString());
                res.status(204).send();
            }
            catch (error) {
                logger_1.logger.error('Error deleting user:', error);
                res.status(500).json({ message: 'Error deleting user', error });
            }
        };
        this.userService = UserService_1.UserService.getInstance();
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.userService.authenticate(email, password);
            res.json(result);
        }
        catch (error) {
            logger_1.logger.error('Login error:', error);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    async register(req, res) {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            logger_1.logger.error('Registration error:', error);
            res.status(400).json({ message: 'Registration failed' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map