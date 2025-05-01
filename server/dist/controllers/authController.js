"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const logger_1 = require("../utils/logger");
const authService_1 = require("../services/authService");
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
                    role: 'user',
                    level: 1,
                    status: 'active',
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
        this.authService = new authService_1.AuthService();
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map