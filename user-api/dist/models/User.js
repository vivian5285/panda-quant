"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationCode: String,
    verificationCodeExpires: Date,
    walletAddress: String,
    totalDeposits: {
        type: Number,
        default: 0
    },
    accountBalance: {
        type: Number,
        default: 0
    },
    subscriptionFee: {
        type: Number,
        default: 0
    },
    depositAddresses: [{
            chain: String,
            address: String
        }]
}, {
    timestamps: true
});
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.UserModel = exports.User;
//# sourceMappingURL=User.js.map