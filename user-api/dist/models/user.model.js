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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../utils/errors");
const validation_1 = require("../utils/validation");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
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
        enum: ['user', 'admin'],
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
    },
    walletAddress: {
        type: String,
        default: undefined
    }
}, {
    timestamps: true
});
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
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
userSchema.statics.findByEmail = async function (email) {
    return this.findOne({ email });
};
userSchema.statics.updateVerificationCode = async function (userId, code, expires) {
    try {
        await this.findByIdAndUpdate(userId, {
            verificationCode: code,
            verificationCodeExpires: expires
        });
    }
    catch (error) {
        throw new errors_1.DatabaseError('Failed to update verification code');
    }
};
userSchema.statics.verifyEmail = async function (userId) {
    try {
        await this.findByIdAndUpdate(userId, {
            isVerified: true,
            verificationCode: undefined,
            verificationCodeExpires: undefined
        });
    }
    catch (error) {
        throw new errors_1.DatabaseError('Failed to verify email');
    }
};
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.model.js.map