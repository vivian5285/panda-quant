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
exports.UserModel = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errors_1 = require("../utils/errors");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    walletAddress: { type: String, unique: true, sparse: true },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    isAdmin: { type: Boolean, default: false },
    adminType: { type: String },
    permissions: { type: mongoose_1.Schema.Types.Mixed },
    lastLogin: { type: Date },
}, {
    timestamps: true
});
// 密码哈希中间件
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// 密码验证方法
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw error;
    }
};
exports.User = mongoose_1.default.model('User', userSchema);
class UserModel {
    async findByEmail(email) {
        try {
            const result = await exports.User.findOne({ email }).exec();
            return result || null;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding user by email', error);
        }
    }
    async findByUsername(username) {
        try {
            const result = await exports.User.findOne({ username }).exec();
            return result || null;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding user by username', error);
        }
    }
    async findById(id) {
        try {
            const result = await exports.User.findById(id).exec();
            return result || null;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding user by id', error);
        }
    }
    async findByWalletAddress(walletAddress) {
        try {
            const result = await exports.User.findOne({ walletAddress }).exec();
            return result || null;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding user by wallet address', error);
        }
    }
    async create(email, password, walletAddress) {
        try {
            const user = new exports.User({
                email,
                password,
                walletAddress: walletAddress || null
            });
            const result = await user.save();
            return result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error creating user', error);
        }
    }
    async updateUsername(id, username) {
        try {
            const result = await exports.User.findByIdAndUpdate(id, { username }, { new: true }).exec();
            return result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating username', error);
        }
    }
    async updateStatus(id, status) {
        try {
            const result = await exports.User.findByIdAndUpdate(id, { status }, { new: true }).exec();
            return result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating user status', error);
        }
    }
    async updateLastLogin(id) {
        try {
            await exports.User.findByIdAndUpdate(id, { lastLogin: Date.now() }).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating last login', error);
        }
    }
    async verifyPassword(user, password) {
        try {
            return await user.comparePassword(password);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error verifying password', error);
        }
    }
    async findAllUsers(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const [usersResult, countResult] = await Promise.all([
                exports.User.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
                exports.User.countDocuments().exec()
            ]);
            return {
                users: usersResult,
                total: countResult
            };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding users', error);
        }
    }
    async updateUserRole(id, role, isAdmin, adminType) {
        try {
            const result = await exports.User.findByIdAndUpdate(id, { role, isAdmin, adminType }, { new: true }).exec();
            return result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating user role', error);
        }
    }
    async updateUserPermissions(id, permissions) {
        try {
            const result = await exports.User.findByIdAndUpdate(id, { permissions }, { new: true }).exec();
            return result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating user permissions', error);
        }
    }
    async deleteUser(id) {
        try {
            await exports.User.findByIdAndDelete(id).exec();
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error deleting user', error);
        }
    }
    async searchUsers(query, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const searchPattern = new RegExp(query, 'i');
            const [usersResult, countResult] = await Promise.all([
                exports.User.find({
                    $or: [
                        { email: searchPattern },
                        { username: searchPattern }
                    ]
                }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
                exports.User.countDocuments({
                    $or: [
                        { email: searchPattern },
                        { username: searchPattern }
                    ]
                }).exec()
            ]);
            return {
                users: usersResult,
                total: countResult
            };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error searching users', error);
        }
    }
    async findByRole(role, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const [usersResult, countResult] = await Promise.all([
                exports.User.find({ role }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
                exports.User.countDocuments({ role }).exec()
            ]);
            return {
                users: usersResult,
                total: countResult
            };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding users by role', error);
        }
    }
    async updateWalletAddress(id, walletAddress) {
        try {
            const result = await exports.User.findByIdAndUpdate(id, { walletAddress }, { new: true }).exec();
            return result;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating wallet address', error);
        }
    }
}
exports.UserModel = UserModel;
