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
exports.Trade = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const tradeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    strategyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Strategy', required: true },
    symbol: { type: String, required: true },
    type: { type: String, enum: ['long', 'short'], required: true },
    side: { type: String, enum: ['buy', 'sell'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'executed', 'cancelled', 'failed'], default: 'pending' },
    executedAt: { type: Date },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加索引
tradeSchema.index({ userId: 1 });
tradeSchema.index({ strategyId: 1 });
tradeSchema.index({ symbol: 1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ createdAt: -1 });
exports.Trade = mongoose_1.default.model('Trade', tradeSchema);
exports.default = exports.Trade;
//# sourceMappingURL=Trade.js.map