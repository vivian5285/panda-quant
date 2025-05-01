import { Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
