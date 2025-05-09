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
exports.Strategy = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const strategySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['manual', 'automated'], required: true },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], required: true },
    config: {
        tradingPairs: [{ type: String, required: true }],
        timeframe: { type: String, required: true },
        riskLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
        maxPositions: { type: Number, required: true },
        maxDrawdown: { type: Number, required: true },
        stopLoss: { type: Number, required: true },
        takeProfit: { type: Number, required: true }
    },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
strategySchema.index({ userId: 1 });
strategySchema.index({ name: 1 });
strategySchema.index({ type: 1 });
strategySchema.index({ status: 1 });
strategySchema.index({ 'config.tradingPairs': 1 });
strategySchema.index({ 'config.timeframe': 1 });
strategySchema.index({ createdAt: -1 });
exports.Strategy = mongoose_1.default.model('Strategy', strategySchema);
exports.default = exports.Strategy;
//# sourceMappingURL=strategy.model.js.map