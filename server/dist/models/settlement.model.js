"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Settlement_1 = require("../types/Settlement");
const Enums_1 = require("../types/Enums");
const SettlementSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: Object.values(Enums_1.SettlementType) },
    status: { type: String, required: true, enum: Object.values(Settlement_1.SettlementStatus) },
    referenceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Commission', required: true },
    referenceType: { type: String, required: true },
    description: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 使用类型断言来解决类型不匹配问题
const SettlementModel = (0, mongoose_1.model)('Settlement', SettlementSchema);
exports.default = SettlementModel;
//# sourceMappingURL=settlement.model.js.map