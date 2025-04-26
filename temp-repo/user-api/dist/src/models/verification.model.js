"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.VerificationModel = exports.Verification = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const errors_1 = require("../utils/errors");
const verificationSchema = new mongoose_1.Schema({
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    type: { type: String, required: true, enum: ['register', 'reset-password'] },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
}, {
    timestamps: true
});
// 创建索引
verificationSchema.index({ email: 1, type: 1 });
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.Verification = mongoose_1.default.model('Verification', verificationSchema);
class VerificationModel {
    create(email, code, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 设置验证码过期时间为10分钟
                const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
                const verification = new exports.Verification({
                    email,
                    code,
                    type,
                    expiresAt,
                });
                return yield verification.save();
            }
            catch (error) {
                throw new errors_1.DatabaseError('Error creating verification code', error);
            }
        });
    }
    findByEmailAndCode(email, code, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield exports.Verification.findOne({
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
        });
    }
    markAsUsed(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield exports.Verification.findByIdAndUpdate(id, { isUsed: true }).exec();
            }
            catch (error) {
                throw new errors_1.DatabaseError('Error marking verification code as used', error);
            }
        });
    }
    deleteByEmail(email, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield exports.Verification.deleteMany({ email, type }).exec();
            }
            catch (error) {
                throw new errors_1.DatabaseError('Error deleting verification codes', error);
            }
        });
    }
}
exports.VerificationModel = VerificationModel;
