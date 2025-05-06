import mongoose, { Schema } from 'mongoose';
import { CommissionType, CommissionStatus } from '../types/Enums';
const commissionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(CommissionType), required: true },
    status: { type: String, enum: Object.values(CommissionStatus), default: CommissionStatus.PENDING },
    description: { type: String },
    referenceId: { type: Schema.Types.ObjectId, required: true },
    referenceType: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加中间件来自动更新updatedAt字段
commissionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
export const Commission = mongoose.model('Commission', commissionSchema);
//# sourceMappingURL=Commission.js.map