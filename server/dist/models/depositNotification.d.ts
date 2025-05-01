import { Document, Types } from 'mongoose';
import { IDepositNotification } from '../types/notification';
export interface IDepositNotificationDocument extends IDepositNotification, Document {
    _id: Types.ObjectId;
}
export declare const DepositNotification: import("mongoose").Model<IDepositNotificationDocument, {}, {}, {}, Document<unknown, {}, IDepositNotificationDocument, {}> & IDepositNotificationDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default DepositNotification;
