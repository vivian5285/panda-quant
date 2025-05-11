import { Schema, model, Document, Types } from 'mongoose';
import { IAdmin, IAdminDocument } from '../types/Admin';

const adminSchema = new Schema<IAdminDocument>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'admin'
  },
  permissions: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Admin = model<IAdminDocument>('Admin', adminSchema);
export default Admin; 