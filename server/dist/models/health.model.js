import { Schema, model } from 'mongoose';
const healthSchema = new Schema({
    networkStatus: {
        type: Schema.Types.Mixed,
        required: true
    },
    lastChecked: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
export const Health = model('Health', healthSchema);
//# sourceMappingURL=health.model.js.map