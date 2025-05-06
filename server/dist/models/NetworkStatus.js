import { Schema, model } from 'mongoose';
const NetworkStatusSchema = new Schema({
    network: { type: String, required: true },
    status: { type: String, required: true, enum: ['online', 'offline', 'error', 'checking'] },
    lastChecked: { type: Date, default: Date.now },
    blockHeight: { type: Number },
    latency: { type: Number, required: true },
    type: { type: String, required: true, enum: ['database', 'api', 'redis', 'websocket'] },
    responseTime: { type: Number, required: true },
    error: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
export default model('NetworkStatus', NetworkStatusSchema);
//# sourceMappingURL=NetworkStatus.js.map