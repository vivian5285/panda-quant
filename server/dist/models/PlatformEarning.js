import mongoose, { Schema } from 'mongoose';
const platformEarningSchema = new Schema({
    userId: {
        type: String,
        required: [true, '用户ID是必需的'],
        trim: true
    },
    strategyId: {
        type: String,
        required: [true, '策略ID是必需的'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, '金额是必需的']
    },
    currency: {
        type: String,
        required: [true, '货币是必需的'],
        trim: true
    },
    type: {
        type: String,
        required: [true, '类型是必需的'],
        enum: {
            values: ['commission', 'fee', 'other'],
            message: '无效的类型'
        }
    },
    description: {
        type: String,
        trim: true
    },
    metadata: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true
});
// 添加索引
platformEarningSchema.index({ userId: 1 });
platformEarningSchema.index({ strategyId: 1 });
platformEarningSchema.index({ type: 1 });
platformEarningSchema.index({ createdAt: -1 });
export const PlatformEarning = mongoose.model('PlatformEarning', platformEarningSchema);
//# sourceMappingURL=PlatformEarning.js.map