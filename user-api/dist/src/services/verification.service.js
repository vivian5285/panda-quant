"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
const verification_model_1 = require("../models/verification.model");
const user_model_1 = require("../models/user.model");
const verification_model_2 = require("../models/verification.model");
const VERIFICATION_CODE_LENGTH = 6;
class VerificationService {
    async generateCode(type, email) {
        try {
            const code = Math.random().toString().slice(2, 2 + VERIFICATION_CODE_LENGTH);
            await verification_model_1.Verification.create(email, code, type);
            return code;
        }
        catch (error) {
            console.error('Error generating verification code:', error);
            throw error;
        }
    }
    async verifyCode(email, code, type) {
        try {
            const verification = await verification_model_1.Verification.findByEmailAndCode(email, code, type);
            if (!verification) {
                throw new Error('Invalid or expired verification code');
            }
            if (!verification._id) {
                throw new Error('Invalid verification record');
            }
            await verification_model_1.Verification.markAsUsed(verification._id.toString());
            return true;
        }
        catch (error) {
            console.error('Error verifying code:', error);
            throw error;
        }
    }
    async sendVerificationEmail(user) {
        await verification_model_2.VerificationCode.create({
            email: user.email,
            code: user.verificationCode,
            type: 'register',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        await (0, email_1.sendEmail)({
            to: user.email,
            subject: 'Verify your email',
            text: `Your verification code is: ${user.verificationCode}`
        });
    }
    async verifyEmailCode(code) {
        const verification = await verification_model_2.VerificationCode.findOne({
            code,
            type: 'register',
            expiresAt: { $gt: new Date() }
        });
        if (!verification) {
            throw new Error('Invalid or expired verification code');
        }
        await user_model_1.User.findOneAndUpdate({ email: verification.email }, { isVerified: true });
        await verification_model_2.VerificationCode.deleteOne({ _id: verification._id });
    }
    async sendPasswordResetEmail(user) {
        const token = (0, jwt_1.generateToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });
        await verification_model_2.VerificationCode.create({
            email: user.email,
            code: token,
            type: 'reset-password',
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
        });
        await (0, email_1.sendEmail)({
            to: user.email,
            subject: 'Reset your password',
            text: `Click here to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
            html: `
        <h1>Password Reset</h1>
        <p>Click the following link to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
        });
    }
    async resetPassword(token, hashedPassword) {
        const verification = await verification_model_2.VerificationCode.findOne({
            code: token,
            type: 'reset-password',
            expiresAt: { $gt: new Date() }
        });
        if (!verification) {
            throw new Error('Invalid or expired reset token');
        }
        await user_model_1.User.findOneAndUpdate({ email: verification.email }, { password: hashedPassword });
        await verification_model_2.VerificationCode.deleteOne({ _id: verification._id });
    }
    async verifyEmailToken(token) {
        try {
            const user = await (0, jwt_1.verifyToken)(token);
            return user.id;
        }
        catch (error) {
            throw new errors_1.ValidationError('Invalid or expired token');
        }
    }
    async verifyPasswordResetToken(token) {
        try {
            const user = await (0, jwt_1.verifyToken)(token);
            return user.id;
        }
        catch (error) {
            throw new errors_1.ValidationError('Invalid or expired token');
        }
    }
}
exports.VerificationService = VerificationService;
//# sourceMappingURL=verification.service.js.map