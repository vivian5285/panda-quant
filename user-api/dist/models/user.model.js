"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../utils/errors");
const validation_1 = require("../utils/validation");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: validation_1.validateEmail,
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: validation_1.validatePassword,
            message: 'Password must be at least 8 characters long'
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: String,
        default: 'active'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    permissions: {
        type: mongoose_1.SchemaTypes.Mixed,
        default: {}
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: undefined
    },
    verificationCodeExpires: {
        type: Date,
        default: undefined
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
// 静态方法
class User {
    static async findByEmail(email) {
        return exports.UserModel.findOne({ email });
    }
    static async create(userData) {
        try {
            return await exports.UserModel.create(userData);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to create user');
        }
    }
    static async updateVerificationCode(userId, code, expires) {
        try {
            await exports.UserModel.findByIdAndUpdate(userId, {
                verificationCode: code,
                verificationCodeExpires: expires
            });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to update verification code');
        }
    }
    static async verifyEmail(userId) {
        try {
            await exports.UserModel.findByIdAndUpdate(userId, {
                isVerified: true,
                verificationCode: undefined,
                verificationCodeExpires: undefined
            });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to verify email');
        }
    }
}
exports.User = User;
