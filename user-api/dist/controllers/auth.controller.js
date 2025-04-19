"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const verification_service_1 = require("../services/verification.service");
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const { email, password, name } = req.body;
                if (!email || !password || !name) {
                    throw new errors_1.ValidationError('Missing required fields');
                }
                const hashedPassword = await (0, password_1.hashPassword)(password);
                const user = await this.userModel.createUser({
                    email,
                    password: hashedPassword,
                    name,
                    isVerified: false
                });
                await this.verificationService.sendVerificationEmail(user);
                res.status(201).json({
                    message: 'User registered successfully. Please check your email for verification.'
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else if (error instanceof errors_1.DatabaseError) {
                    res.status(409).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new errors_1.ValidationError('Missing required fields');
                }
                const user = await this.userModel.findUserByEmail(email);
                if (!user) {
                    throw new errors_1.ValidationError('Invalid credentials');
                }
                const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
                if (!isPasswordValid) {
                    throw new errors_1.ValidationError('Invalid credentials');
                }
                if (!user.isVerified) {
                    throw new errors_1.ValidationError('Please verify your email first');
                }
                const token = (0, jwt_1.generateToken)(user);
                res.json({
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    }
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(401).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.verifyEmail = async (req, res) => {
            try {
                const { token } = req.body;
                if (!token) {
                    throw new errors_1.ValidationError('Token is required');
                }
                const userId = await this.verificationService.verifyEmailToken(token);
                await this.userModel.verifyUser(userId);
                res.json({ message: 'Email verified successfully' });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.resendVerification = async (req, res) => {
            try {
                const { email } = req.body;
                if (!email) {
                    throw new errors_1.ValidationError('Email is required');
                }
                const user = await this.userModel.findUserByEmail(email);
                if (!user) {
                    throw new errors_1.ValidationError('User not found');
                }
                if (user.isVerified) {
                    throw new errors_1.ValidationError('Email is already verified');
                }
                await this.verificationService.sendVerificationEmail(user);
                res.json({ message: 'Verification email sent' });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.getProfile = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new errors_1.ValidationError('User not authenticated');
                }
                const user = await this.userModel.findUserById(userId);
                if (!user) {
                    throw new errors_1.ValidationError('User not found');
                }
                res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    }
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.updateProfile = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new errors_1.ValidationError('User not authenticated');
                }
                const { name } = req.body;
                if (!name) {
                    throw new errors_1.ValidationError('Name is required');
                }
                const user = await this.userModel.updateUser(userId, { name });
                res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    }
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.changePassword = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new errors_1.ValidationError('User not authenticated');
                }
                const { currentPassword, newPassword } = req.body;
                if (!currentPassword || !newPassword) {
                    throw new errors_1.ValidationError('Current password and new password are required');
                }
                const user = await this.userModel.findUserById(userId);
                if (!user) {
                    throw new errors_1.ValidationError('User not found');
                }
                const isPasswordValid = await (0, password_1.comparePassword)(currentPassword, user.password);
                if (!isPasswordValid) {
                    throw new errors_1.ValidationError('Current password is incorrect');
                }
                const hashedPassword = await (0, password_1.hashPassword)(newPassword);
                await this.userModel.updateUser(userId, { password: hashedPassword });
                res.json({ message: 'Password updated successfully' });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                if (!email) {
                    throw new errors_1.ValidationError('Email is required');
                }
                const user = await this.userModel.findUserByEmail(email);
                if (!user) {
                    // Return success even if user doesn't exist for security
                    res.json({ message: 'If an account exists with this email, you will receive a password reset link' });
                    return;
                }
                await this.verificationService.sendPasswordResetEmail(user);
                res.json({ message: 'If an account exists with this email, you will receive a password reset link' });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { token, newPassword } = req.body;
                if (!token || !newPassword) {
                    throw new errors_1.ValidationError('Token and new password are required');
                }
                const userId = await this.verificationService.verifyPasswordResetToken(token);
                const hashedPassword = await (0, password_1.hashPassword)(newPassword);
                await this.userModel.updateUser(userId, { password: hashedPassword });
                res.json({ message: 'Password reset successfully' });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        };
        this.userModel = new User_1.UserModel();
        this.verificationService = new verification_service_1.VerificationService();
    }
}
exports.AuthController = AuthController;
