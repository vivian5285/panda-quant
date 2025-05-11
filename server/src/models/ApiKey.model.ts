import { Schema, model } from 'mongoose';
import { IApiKeyDocument } from '../types/ApiKey';

const apiKeySchema = new Schema<IApiKeyDocument>(
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
    key: {
      type: String,
      required: true,
      unique: true
    },
    secret: {
      type: String,
      required: true
    },
    permissions: [{
      type: String
    }],
    status: {
      type: String,
      required: true,
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

export const ApiKey = model<IApiKeyDocument>('ApiKey', apiKeySchema); 