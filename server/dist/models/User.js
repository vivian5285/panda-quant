"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    level: {
        type: Number,
        default: 1
    },
    permissions: [{
            type: String
        }],
    referrerId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    referrer: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
userSchema.methods['comparePassword'] = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this['password']);
};
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this['password'] = await bcryptjs_1.default.hash(this['password'], 10);
    }
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.default = exports.User;
//# sourceMappingURL=User.js.map