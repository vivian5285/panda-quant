import mongoose from 'mongoose';
import { IBlacklistEntry } from '../types/Blacklist';
export declare const BlacklistEntry: mongoose.Model<IBlacklistEntry, {}, {}, {}, mongoose.Document<unknown, {}, IBlacklistEntry, {}> & IBlacklistEntry & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=Blacklist.d.ts.map