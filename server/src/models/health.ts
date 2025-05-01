import { Schema, model, Document } from 'mongoose';

export interface IHealth extends Document {
  status: 'healthy' | 'unhealthy';
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}

const healthSchema = new Schema<IHealth>({
  status: { 
    type: String, 
    required: true,
    enum: ['healthy', 'unhealthy']
  },
  lastChecked: { type: Date, required: true }
}, {
  timestamps: true
});

export const Health = model<IHealth>('Health', healthSchema);
export default Health; 