"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const logger_1 = require("../utils/logger");
const AuthService_1 = require("../services/AuthService");
const Enums_1 = require("../types/Enums");
class AuthController {
    constructor() {
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login(email, password);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Error during login:', error);
                res.status(401).json({ message: 'Invalid credentials' });
            }
        };
        this.register = async (req, res) => {
            try {
                const { email, password, name } = req.body;
                const userData = {
                    email,
                    password,
                    name,
                    username: email.split('@')[0],
                    role: Enums_1.UserRole.USER,
                    level: Enums_1.UserLevel.BASIC,
                    status: Enums_1.UserStatus.ACTIVE,
                    permissions: []
                };
                const user = await this.authService.register(userData);
                res.status(201).json(user);
            }
            catch (error) {
                logger_1.logger.error('Error during registration:', error);
                res.status(400).json({ message: 'Registration failed', error: error.message });
            }
        };
        this.getCurrentUser = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const user = await this.authService.getCurrentUser(req.user._id.toString());
                res.json(user);
            }
            catch (error) {
                logger_1.logger.error('Error getting current user:', error);
                res.status(500).json({ message: 'Error getting current user', error: error.message });
            }
        };
        this.logout = async (req, res) => {
            try {
                // 清除用户会话或令牌
                res.status(200).json({ message: 'Logged out successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error during logout:', error);
                res.status(500).json({ message: 'Error during logout', error: error.message });
            }
        };
        this.updateUser = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const user = await this.authService.updateUser(req.user._id.toString(), req.body);
                res.json(user);
            }
            catch (error) {
                logger_1.logger.error('Error updating user:', error);
                res.status(500).json({ message: 'Error updating user', error: error.message });
            }
        };
        this.changePassword = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const { currentPassword, newPassword } = req.body;
                await this.authService.changePassword(req.user._id.toString(), currentPassword, newPassword);
                res.json({ message: 'Password changed successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error changing password:', error);
                res.status(500).json({ message: 'Error changing password', error: error.message });
            }
        };
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map