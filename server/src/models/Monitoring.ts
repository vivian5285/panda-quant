import { Schema, model } from 'mongoose';
import { IMonitoring } from '../types/IMonitoring';

const monitoringSchema = new Schema<IMonitoring>({
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

export const Monitoring = model<IMonitoring>('Monitoring', monitoringSchema);
export default Monitoring; 