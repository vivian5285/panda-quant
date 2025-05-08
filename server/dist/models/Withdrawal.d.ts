import mongoose from 'mongoose';
import { IWithdrawalDocument } from '../types/Withdrawal';
export declare const Withdrawal: mongoose.Model<IWithdrawalDocument, {}, {}, {}, mongoose.Document<unknown, {}, IWithdrawalDocument, {}> & IWithdrawalDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Withdrawal;
//# sourceMappingURL=Withdrawal.d.ts.map