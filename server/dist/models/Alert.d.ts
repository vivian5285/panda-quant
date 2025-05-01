import mongoose from 'mongoose';
import { IAlert } from '../types/alert';
export declare const Alert: mongoose.Model<IAlert & mongoose.Document<unknown, any, any, Record<string, any>>, {}, {}, {}, mongoose.Document<unknown, {}, IAlert & mongoose.Document<unknown, any, any, Record<string, any>>, {}> & IAlert & mongoose.Document<unknown, any, any, Record<string, any>> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
