"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const verification_service_1 = require("../services/verification.service");
const errors_1 = require("../utils/errors");
class VerificationController {
    constructor() {
        this.sendCode = async (req, res) => {
            try {
                const { email, type } = req.body;
                if (!email || !type) {
                    throw new errors_1.ValidationError('Email and type are required');
                }
                if (type !== 'register' && type !== 'reset-password') {
                    throw new errors_1.ValidationError('Invalid verification type');
                }
                await this.verificationService.sendVerificationCode(email, type);
                res.json({
                    success: true,
                    message: 'Verification code sent successfully'
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Failed to send verification code'
                    });
                }
            }
        };
        this.verifyCode = async (req, res) => {
            try {
                const { email, code, type } = req.body;
                if (!email || !code || !type) {
                    throw new errors_1.ValidationError('Email, code and type are required');
                }
                if (type !== 'register' && type !== 'reset-password') {
                    throw new errors_1.ValidationError('Invalid verification type');
                }
                const isValid = await this.verificationService.verifyCode(email, code, type);
                if (!isValid) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid verification code'
                    });
                    return;
                }
                res.json({
                    success: true,
                    message: 'Verification code is valid'
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Failed to verify code'
                    });
                }
            }
        };
        this.verificationService = new verification_service_1.VerificationService();
    }
}
exports.VerificationController = VerificationController;
