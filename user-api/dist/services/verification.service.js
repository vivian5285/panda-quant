"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
class VerificationService {
    constructor() {
        this.EMAIL_VERIFICATION_EXPIRY = '24h';
        this.PASSWORD_RESET_EXPIRY = '1h';
    }
    async sendVerificationEmail(user) {
        const token = (0, jwt_1.generateToken)(user, this.EMAIL_VERIFICATION_EXPIRY);
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        if (process.env.NODE_ENV !== 'test') {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: 'Verify your email',
                text: `Please click the following link to verify your email: ${verificationUrl}`,
                html: `
          <h1>Email Verification</h1>
          <p>Please click the following link to verify your email:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        `
            });
        }
    }
    async sendPasswordResetEmail(user) {
        const token = (0, jwt_1.generateToken)(user, this.PASSWORD_RESET_EXPIRY);
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        if (process.env.NODE_ENV !== 'test') {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: 'Reset your password',
                text: `Please click the following link to reset your password: ${resetUrl}`,
                html: `
          <h1>Password Reset</h1>
          <p>Please click the following link to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
        `
            });
        }
    }
    async verifyEmailToken(token) {
        try {
            const decoded = (0, jwt_1.verifyToken)(token);
            return decoded.id;
        }
        catch (error) {
            throw new errors_1.ValidationError('Invalid or expired verification token');
        }
    }
    async verifyPasswordResetToken(token) {
        try {
            const decoded = (0, jwt_1.verifyToken)(token);
            return decoded.id;
        }
        catch (error) {
            throw new errors_1.ValidationError('Invalid or expired password reset token');
        }
    }
}
exports.VerificationService = VerificationService;
