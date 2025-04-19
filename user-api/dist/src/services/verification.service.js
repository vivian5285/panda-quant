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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const verification_model_1 = require("../models/verification.model");
const user_model_1 = require("../models/user.model");
const errors_1 = require("../utils/errors");
const nodemailer_1 = __importDefault(require("nodemailer"));
class VerificationService {
    constructor() {
        this.verificationModel = new verification_model_1.VerificationModel();
        this.userModel = new user_model_1.UserModel();
        // 创建邮件发送器
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    sendVerificationCode(email, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 检查邮箱是否已注册
                if (type === 'register') {
                    const existingUser = yield this.userModel.findByEmail(email);
                    if (existingUser) {
                        throw new errors_1.ServiceError('Email already registered');
                    }
                }
                // 生成6位数字验证码
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                // 删除该邮箱之前的验证码
                yield this.verificationModel.deleteByEmail(email, type);
                // 创建新的验证码记录
                yield this.verificationModel.create(email, code, type);
                // 发送验证码邮件
                yield this.transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: type === 'register' ? '注册验证码' : '重置密码验证码',
                    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${type === 'register' ? '注册验证码' : '重置密码验证码'}</h2>
            <p>您的验证码是：<strong>${code}</strong></p>
            <p>验证码有效期为10分钟，请尽快使用。</p>
            <p>如果这不是您的操作，请忽略此邮件。</p>
          </div>
        `,
                });
            }
            catch (error) {
                if (error instanceof errors_1.ServiceError) {
                    throw error;
                }
                throw new errors_1.ServiceError('Failed to send verification code', error);
            }
        });
    }
    verifyCode(email, code, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verification = yield this.verificationModel.findByEmailAndCode(email, code, type);
                if (!verification) {
                    return false;
                }
                // 标记验证码为已使用
                yield this.verificationModel.markAsUsed(verification._id.toString());
                return true;
            }
            catch (error) {
                throw new errors_1.ServiceError('Failed to verify code', error);
            }
        });
    }
}
exports.VerificationService = VerificationService;
