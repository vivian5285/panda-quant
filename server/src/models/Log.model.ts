import { Schema, model } from 'mongoose';
import { ILogDocument } from '../types/Log';

const logSchema = new Schema<ILogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    strategyId: {
      type: Schema.Types.ObjectId,
      ref: 'Strategy',
      required: true
    },
    level: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    data: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export const Log = model<ILogDocument>('Log', logSchema); 