import mongoose, { Document } from 'mongoose';
export interface IUserEarning extends Document {
    userId: mongoose.Types.ObjectId;
    settlementId: mongoose.Types.ObjectId;
    amount: number;
    level: number;
    createdAt: Date;
}
export declare const UserEarning: mongoose.Model<IUserEarning, {}, {}, {}, mongoose.Document<unknown, {}, IUserEarning, {}> & IUserEarning & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserEarning.d.ts.map