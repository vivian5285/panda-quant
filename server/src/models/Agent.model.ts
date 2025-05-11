import { Schema, model, Document, Types } from 'mongoose';
import { IAgent } from '../types/Agent';

export interface IAgentDocument extends IAgent, Document {
  _id: Types.ObjectId;
}

const agentSchema = new Schema<IAgentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
      required: true,
      default: 'active'
    },
    config: {
      type: Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Agent = model<IAgentDocument>('Agent', agentSchema); 