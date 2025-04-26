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
exports.VerificationController = void 0;
const verification_service_1 = require("../services/verification.service");
const errors_1 = require("../utils/errors");
class VerificationController {
    constructor() {
        this.sendCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, type } = req.body;
                if (!email || !type) {
                    throw new errors_1.ValidationError('Email and type are required');
                }
                if (type !== 'register' && type !== 'reset-password') {
                    throw new errors_1.ValidationError('Invalid verification type');
                }
                yield this.verificationService.sendVerificationCode(email, type);
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
        });
        this.verifyCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, code, type } = req.body;
                if (!email || !code || !type) {
                    throw new errors_1.ValidationError('Email, code and type are required');
                }
                if (type !== 'register' && type !== 'reset-password') {
                    throw new errors_1.ValidationError('Invalid verification type');
                }
                const isValid = yield this.verificationService.verifyCode(email, code, type);
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
        });
        this.verificationService = new verification_service_1.VerificationService();
    }
}
exports.VerificationController = VerificationController;
