import mongoose, { Schema } from 'mongoose';
import { IMonitoring } from '../types/IMonitoring';

const monitoringSchema = new Schema<IMonitoring>({
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  status: { type: String, required: true },
  lastCheck: { type: Date, default: Date.now },
  metrics: {
    cpu: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    latency: { type: Number, default: 0 },
    errorRate: { type: Number, default: 0 }
  },
  alerts: [{
    type: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
  }]
}, {
  timestamps: true
});

export const Monitoring = mongoose.model<IMonitoring>('Monitoring', monitoringSchema);
export default Monitoring; 