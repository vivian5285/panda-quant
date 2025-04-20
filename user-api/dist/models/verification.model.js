"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errors_1 = require("../utils/errors");
const verificationSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['register', 'reset-password']
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// 创建索引
verificationSchema.index({ email: 1 });
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.VerificationModel = mongoose_1.default.model('Verification', verificationSchema);
class VerificationModel {
    async create(email, code, type) {
        try {
            // 设置验证码过期时间为10分钟
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const verification = new VerificationModel({
                email,
                code,
                type,
                expiresAt,
            });
            return await verification.save();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error creating verification code', error);
        }
    }
    async findByEmailAndCode(email, code, type) {
        try {
            return await VerificationModel.findOne({
                email,
                code,
                type,
                isUsed: false,
                expiresAt: { $gt: new Date() }
            }).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding verification code', error);
        }
    }
    async markAsUsed(id) {
        try {
            await VerificationModel.findByIdAndUpdate(id, { isUsed: true }).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error marking verification code as used', error);
        }
    }
    async deleteByEmail(email, type) {
        try {
            await VerificationModel.deleteMany({ email, type }).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error deleting verification codes', error);
        }
    }
}
exports.VerificationModel = VerificationModel;
