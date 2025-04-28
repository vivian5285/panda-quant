import mongoose from 'mongoose';
import { IUser as SharedIUser } from '../../shared/models/user';
export interface IUser extends SharedIUser {
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
