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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String, required: true },
    walletAddress: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    isAdmin: { type: Boolean, default: false },
    adminType: { type: String },
    permissions: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    balance: { type: Number, default: 0 },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true }
}, {
    timestamps: true
});
// 密码加密中间件
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// 密码比较方法
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// 创建索引
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
// 添加创建管理员账号的静态方法
userSchema.statics.createAdmin = async function (email, password) {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    return this.create({
        email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        isAdmin: true,
        balance: 0,
        name: 'Admin User'
    });
};
exports.User = mongoose_1.default.model('User', userSchema);
