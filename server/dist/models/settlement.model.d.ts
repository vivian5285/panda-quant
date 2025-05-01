import { Document, Types } from 'mongoose';
import { ISettlement } from '../types/settlement';
export interface ISettlementDocument extends Omit<ISettlement, '_id'>, Document {
    _id: Types.ObjectId;
}
declare const SettlementModel: import("mongoose").Model<ISettlementDocument, {}, {}, {}, Document<unknown, {}, ISettlementDocument, {}> & ISettlementDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default SettlementModel;
