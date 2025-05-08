import mongoose from 'mongoose';
import { ITradeDocument } from '../types/Trade';
export declare const Trade: mongoose.Model<ITradeDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITradeDocument, {}> & ITradeDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Trade;
//# sourceMappingURL=Trade.d.ts.map