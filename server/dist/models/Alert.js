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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const alertSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        required: true,
        enum: ['price', 'volume', 'technical', 'strategy_loss', 'news', 'system']
    },
    condition: { type: String, required: true },
    value: { type: Number, required: true },
    status: {
        type: String,
        required: true,
        enum: ['active', 'triggered', 'disabled'],
        default: 'active'
    },
    exchange: { type: String, required: true },
    symbol: { type: String, required: true },
    timeframe: { type: String },
    triggeredAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    error: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    message: { type: String, required: true },
    data: { type: mongoose_1.Schema.Types.Mixed },
    isRead: { type: Boolean, default: false }
});
alertSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.Alert = mongoose_1.default.model('Alert', alertSchema);
//# sourceMappingURL=Alert.js.map