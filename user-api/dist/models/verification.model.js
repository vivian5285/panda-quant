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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verification = exports.VerificationCode = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const errors_1 = require("../utils/errors");
const verificationSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['register', 'reset-password'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
verificationSchema.index({ email: 1 });
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.VerificationCode = mongoose_1.default.model('VerificationCode', verificationSchema);
class Verification {
    static async create(email, code, type) {
        try {
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const verification = new exports.VerificationCode({
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
    static async findByEmailAndCode(email, code, type) {
        try {
            return await exports.VerificationCode.findOne({
                email,
                code,
                type,
                expiresAt: { $gt: new Date() }
            }).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding verification code', error);
        }
    }
    static async markAsUsed(id) {
        try {
            await exports.VerificationCode.findByIdAndUpdate(id, { isUsed: true }).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error marking verification code as used', error);
        }
    }
    static async deleteByEmail(email, type) {
        try {
            await exports.VerificationCode.deleteMany({ email, type }).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error deleting verification codes', error);
        }
    }
}
exports.Verification = Verification;
//# sourceMappingURL=verification.model.js.map