import { Document, Types } from 'mongoose';
import { INetworkStatus } from '../types/network';
export interface IHealthDocument extends Document {
    _id: Types.ObjectId;
    networkStatus: INetworkStatus;
    lastChecked: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Health: import("mongoose").Model<IHealthDocument, {}, {}, {}, Document<unknown, {}, IHealthDocument, {}> & IHealthDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
