"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            const user = await this.authService.register(email, password, name);
            const response = {
                success: true,
                data: user,
                error: null
            };
            res.status(201).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            const response = {
                success: true,
                data: { token },
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(401).json(response);
        }
    }
    async verifyEmail(req, res) {
        try {
            const { code } = req.body;
            await this.authService.verifyEmail(code);
            const response = {
                success: true,
                data: null,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
    async resendVerification(req, res) {
        try {
            const { email } = req.body;
            await this.authService.resendVerification(email);
            const response = {
                success: true,
                data: null,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
    async getProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const user = await this.authService.getProfile(userId);
            const response = {
                success: true,
                data: user,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(401).json(response);
        }
    }
    async updateProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const user = await this.authService.updateProfile(userId, req.body);
            const response = {
                success: true,
                data: user,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
    async changePassword(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const { currentPassword, newPassword } = req.body;
            await this.authService.changePassword(userId, currentPassword, newPassword);
            const response = {
                success: true,
                data: null,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await this.authService.forgotPassword(email);
            const response = {
                success: true,
                data: null,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            await this.authService.resetPassword(token, newPassword);
            const response = {
                success: true,
                data: null,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
    async sendVerificationCode(req, res) {
        try {
            const { email, type } = req.body;
            await this.authService.sendVerificationCode(email, type);
            const response = {
                success: true,
                data: null,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map