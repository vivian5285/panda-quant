import { Schema, model } from 'mongoose';
import { IAnalysisDocument } from '../types/Analysis';

const analysisSchema = new Schema<IAnalysisDocument>(
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
    type: {
      type: String,
      required: true
    },
    data: {
      type: Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      required: true,
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export const Analysis = model<IAnalysisDocument>('Analysis', analysisSchema); 