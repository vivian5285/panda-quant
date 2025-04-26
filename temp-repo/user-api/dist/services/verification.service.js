"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
const common_1 = require("@nestjs/common");
let VerificationService = class VerificationService {
    constructor() {
        this.EMAIL_VERIFICATION_EXPIRY = '24h';
        this.PASSWORD_RESET_EXPIRY = '1h';
        this.CODE_EXPIRY = 300; // 5 minutes
        this.codeCache = new Map();
    }
    async generateCode(type, email) {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiry = Date.now() + this.CODE_EXPIRY * 1000;
            // 存储验证码到内存缓存
            this.codeCache.set(`${type}:${email}`, { code, expiry });
            // 清理过期验证码
            this.cleanupExpiredCodes();
            // 发送验证码邮件
            await (0, email_1.sendVerificationEmail)(email, code);
            return code;
        }
        catch (error) {
            // 如果发送邮件失败，从缓存中删除验证码
            this.codeCache.delete(`${type}:${email}`);
            throw new errors_1.ValidationError('Failed to send verification code: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async verifyCode(email, code, type) {
        const key = `${type}:${email}`;
        const stored = this.codeCache.get(key);
        if (!stored) {
            return false;
        }
        // 检查是否过期
        if (Date.now() > stored.expiry) {
            this.codeCache.delete(key);
            return false;
        }
        // 验证码正确，删除验证码
        if (stored.code === code) {
            this.codeCache.delete(key);
            return true;
        }
        return false;
    }
    cleanupExpiredCodes() {
        const now = Date.now();
        for (const [key, value] of this.codeCache.entries()) {
            if (now > value.expiry) {
                this.codeCache.delete(key);
            }
        }
    }
    async sendVerificationEmail(email, type) {
        const code = await this.generateCode(type === 'register' ? 'register' : 'reset', email);
        if (process.env.NODE_ENV !== 'test') {
            await (0, email_1.sendEmail)({
                to: email,
                subject: type === 'register' ? 'Verify your email' : 'Reset your password',
                text: `Your verification code is: ${code}`,
                html: `
          <h1>${type === 'register' ? 'Email Verification' : 'Password Reset'}</h1>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 5 minutes.</p>
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
            return decoded.userId;
        }
        catch (error) {
            throw new errors_1.ValidationError('Invalid or expired token');
        }
    }
    async verifyPasswordResetToken(token) {
        try {
            const decoded = (0, jwt_1.verifyToken)(token);
            return decoded.userId;
        }
        catch (error) {
            throw new errors_1.ValidationError('Invalid or expired token');
        }
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)()
], VerificationService);
