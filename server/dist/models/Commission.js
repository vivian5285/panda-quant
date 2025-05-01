"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commission = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../types/enums");
const CommissionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(enums_1.CommissionType), required: true },
    status: { type: String, enum: Object.values(enums_1.CommissionStatus), default: enums_1.CommissionStatus.PENDING },
    description: { type: String },
    referenceId: { type: String },
    referenceType: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed }
}, { timestamps: true });
exports.Commission = (0, mongoose_1.model)('Commission', CommissionSchema);
//# sourceMappingURL=Commission.js.map