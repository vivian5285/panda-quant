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
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const errors_1 = require("../utils/errors");
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
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// 删除所有索引并重新创建
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
const User = mongoose_1.default.model('User', userSchema);
class UserModel {
    async createUser(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        }
        catch (error) {
            console.error('Detailed error:', error);
            if (error instanceof Error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    throw new errors_1.DatabaseError('Email already exists');
                }
                throw new errors_1.DatabaseError(`Error creating user: ${error.message}`);
            }
            throw new errors_1.DatabaseError('Error creating user');
        }
    }
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding user');
        }
    }
    async findUserById(id) {
        try {
            return await User.findById(id);
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error finding user');
        }
    }
    async updateUser(id, update) {
        try {
            const user = await User.findByIdAndUpdate(id, update, { new: true });
            if (!user) {
                throw new errors_1.DatabaseError('User not found');
            }
            return user;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error updating user');
        }
    }
    async verifyUser(id) {
        try {
            const user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
            if (!user) {
                throw new errors_1.DatabaseError('User not found');
            }
            return user;
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error verifying user');
        }
    }
    async deleteUser(id) {
        try {
            const result = await User.findByIdAndDelete(id);
            if (!result) {
                throw new errors_1.DatabaseError('User not found');
            }
        }
        catch (error) {
            throw new errors_1.DatabaseError('Error deleting user');
        }
    }
}
exports.UserModel = UserModel;
