"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const logger_1 = require("../utils/logger");
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.authService.login(email, password);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Error during login:', error);
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const user = yield this.authService.register(userData);
                res.status(201).json(user);
            }
            catch (error) {
                logger_1.logger.error('Error during registration:', error);
                res.status(400).json({ message: 'Registration failed', error: error.message });
            }
        });
        this.getCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const user = yield this.authService.getCurrentUser(req.user._id.toString());
                res.json(user);
            }
            catch (error) {
                logger_1.logger.error('Error getting current user:', error);
                res.status(500).json({ message: 'Error getting current user', error: error.message });
            }
        });
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map