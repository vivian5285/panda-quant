import { Document, Types } from 'mongoose';
import { ITrade } from '../types/trade';
export type TradeStatus = 'pending' | 'completed' | 'cancelled' | 'failed';
export interface ITradeDocument extends ITrade, Document {
    _id: Types.ObjectId;
}
export declare const Trade: import("mongoose").Model<ITradeDocument, {}, {}, {}, Document<unknown, {}, ITradeDocument, {}> & ITradeDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Trade;
