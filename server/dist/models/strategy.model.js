import mongoose, { Schema } from 'mongoose';
const strategySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
    parameters: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
export const Strategy = mongoose.model('Strategy', strategySchema);
export default Strategy;
//# sourceMappingURL=strategy.model.js.map