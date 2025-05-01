import { Types, Document } from 'mongoose';
export interface IMonitoring extends Document {
    _id: Types.ObjectId;
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'error';
    lastChecked: Date;
    createdAt: Date;
    updatedAt: Date;
}
