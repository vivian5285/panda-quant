import mongoose from 'mongoose';
import { IBacktestDocument } from '../types/Backtest';
export declare const Backtest: mongoose.Model<IBacktestDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBacktestDocument, {}> & IBacktestDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Backtest;
//# sourceMappingURL=Backtest.d.ts.map