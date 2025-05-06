import { Schema, model } from 'mongoose';
const healthSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['healthy', 'unhealthy']
    },
    lastChecked: { type: Date, required: true }
}, {
    timestamps: true
});
export const Health = model('Health', healthSchema);
export default Health;
//# sourceMappingURL=health.js.map