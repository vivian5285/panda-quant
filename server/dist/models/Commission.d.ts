import mongoose, { Types } from 'mongoose';
import { ICommission } from '../types/Commission';
export declare const Commission: mongoose.Model<ICommission, {}, {}, {}, mongoose.Document<unknown, {}, ICommission, {}> & ICommission & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Commission.d.ts.map