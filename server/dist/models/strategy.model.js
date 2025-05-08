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
const Enums_1 = require("../types/Enums");
const strategySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: Object.values(Enums_1.StrategyStatus), default: Enums_1.StrategyStatus.ACTIVE },
    config: {
        exchange: { type: String, required: true },
        symbol: { type: String, required: true },
        timeframe: { type: String, required: true },
        parameters: { type: mongoose_1.Schema.Types.Mixed, required: true },
        riskManagement: {
            maxPositionSize: { type: Number, required: true },
            stopLoss: { type: Number, required: true },
            takeProfit: { type: Number, required: true },
            trailingStop: { type: Number, required: true },
            maxDrawdown: { type: Number, required: true },
            maxOpenTrades: { type: Number, required: true }
        },
        filters: {
            minVolume: { type: Number, required: true },
            minVolatility: { type: Number, required: true },
            maxSpread: { type: Number, required: true },
            allowedSymbols: [{ type: String }],
            excludedSymbols: [{ type: String }]
        },
        notifications: {
            email: { type: Boolean, default: false },
            telegram: { type: Boolean, default: false },
            webhook: { type: Boolean, default: false }
        }
    },
    performance: { type: mongoose_1.Schema.Types.Mixed },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
exports.Strategy = mongoose_1.default.model('Strategy', strategySchema);
exports.default = exports.Strategy;
//# sourceMappingURL=strategy.model.js.map