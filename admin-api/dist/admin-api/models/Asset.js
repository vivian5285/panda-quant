"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const mongoose_1 = require("mongoose");
const assetSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.Asset = (0, mongoose_1.model)('Asset', assetSchema);
