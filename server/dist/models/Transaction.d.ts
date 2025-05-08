import mongoose from 'mongoose';
import { ITransactionDocument } from '../types/Transaction';
export declare const Transaction: mongoose.Model<ITransactionDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITransactionDocument, {}> & ITransactionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Transaction;
//# sourceMappingURL=Transaction.d.ts.map