"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commissionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'paid'], default: 'pending' },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Commission', commissionSchema);
