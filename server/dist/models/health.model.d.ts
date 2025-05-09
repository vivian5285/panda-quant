import mongoose, { Document, Types } from 'mongoose';
import { INetworkStatus } from '../types/Network';
export interface IHealth {
    _id: string;
    networkStatus: INetworkStatus;
    lastChecked: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IHealthDocument extends Document {
    _id: Types.ObjectId;
    networkStatus: INetworkStatus;
    lastChecked: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Health: mongoose.Model<IHealthDocument, {}, {}, {}, mongoose.Document<unknown, {}, IHealthDocument, {}> & IHealthDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Health;
//# sourceMappingURL=health.model.d.ts.map