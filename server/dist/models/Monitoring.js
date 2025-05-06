import { Schema, model } from 'mongoose';
const monitoringSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'error'],
        default: 'active'
    },
    lastChecked: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
export const Monitoring = model('Monitoring', monitoringSchema);
export default Monitoring;
//# sourceMappingURL=Monitoring.js.map