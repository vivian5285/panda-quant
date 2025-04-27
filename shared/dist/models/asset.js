"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fee = exports.UserAsset = exports.Asset = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const assetSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    chain: { type: String, required: true },
    address: { type: String, required: true },
    decimals: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const userAssetSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    assetId: { type: String, required: true },
    amount: { type: Number, required: true },
    balance: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    lastFeeDeduction: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const feeSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
exports.Asset = mongoose_1.default.model('Asset', assetSchema);
exports.UserAsset = mongoose_1.default.model('UserAsset', userAssetSchema);
exports.Fee = mongoose_1.default.model('Fee', feeSchema);
//# sourceMappingURL=asset.js.map