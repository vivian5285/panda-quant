import { Schema, model, Document, Types } from 'mongoose';
import { INetworkStatus } from '../types/Network';

export interface IHealthDocument extends Document {
  _id: Types.ObjectId;
  networkStatus: INetworkStatus;
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}

const healthSchema = new Schema<IHealthDocument>({
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

export const Health = model<IHealthDocument>('Health', healthSchema); 