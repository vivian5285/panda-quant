import mongoose, { Types } from 'mongoose';
import { IAlert } from '../types/Alert';
export declare const Alert: mongoose.Model<IAlert, {}, {}, {}, mongoose.Document<unknown, {}, IAlert, {}> & IAlert & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Alert.d.ts.map