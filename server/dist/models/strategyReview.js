import mongoose, { Schema } from 'mongoose';
const StrategyReviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// 添加中间件来自动更新updatedAt字段
StrategyReviewSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// 添加索引
StrategyReviewSchema.index({ userId: 1 });
StrategyReviewSchema.index({ strategyId: 1 });
StrategyReviewSchema.index({ createdAt: -1 });
export const StrategyReview = mongoose.model('StrategyReview', StrategyReviewSchema);
export default StrategyReview;
//# sourceMappingURL=StrategyReview.js.map