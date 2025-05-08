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
exports.PlatformEarning = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const platformEarningSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: [true, '用户ID是必需的'],
        trim: true
    },
    strategyId: {
        type: String,
        required: [true, '策略ID是必需的'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, '金额是必需的']
    },
    currency: {
        type: String,
        required: [true, '货币是必需的'],
        trim: true
    },
    type: {
        type: String,
        required: [true, '类型是必需的'],
        enum: {
            values: ['commission', 'fee', 'other'],
            message: '无效的类型'
        }
    },
    description: {
        type: String,
        trim: true
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: true
});
// 添加索引
platformEarningSchema.index({ userId: 1 });
platformEarningSchema.index({ strategyId: 1 });
platformEarningSchema.index({ type: 1 });
platformEarningSchema.index({ createdAt: -1 });
exports.PlatformEarning = mongoose_1.default.model('PlatformEarning', platformEarningSchema);
//# sourceMappingURL=PlatformEarning.js.map