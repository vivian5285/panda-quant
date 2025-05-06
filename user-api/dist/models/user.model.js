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
        required: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    balance: {
        type: Number,
        default: 0
    },
    hostingFee: {
        type: Number,
        default: 0
    },
    subscriptionFee: {
        type: Number,
        default: 0
    },
    accountBalance: {
        type: Number,
        default: 0
    },
    subscriptionEndDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'inactive'
    },
    referralCode: {
        type: String,
        unique: true
    },
    referralRewards: {
        type: Number,
        default: 0
    },
    referredBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    inviteCode: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    totalDeposits: {
        type: Number,
        default: 0
    },
    depositAddresses: [{
            chain: String,
            address: String
        }],
    walletAddress: String
}, {
    timestamps: true
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
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
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};
userSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });
};
userSchema.statics.findByInviteCode = function (inviteCode) {
    return this.findOne({ inviteCode });
};
userSchema.statics.generateInviteCode = async function () {
    let inviteCode;
    let isUnique = false;
    while (!isUnique) {
        inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existingUser = await this.findOne({ inviteCode });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return inviteCode;
};
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.model.js.map