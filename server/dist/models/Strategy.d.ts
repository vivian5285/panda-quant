import { IStrategy } from '../types/strategy';
export declare const Strategy: import("mongoose").Model<IStrategy, {}, {}, {}, import("mongoose").Document<unknown, {}, IStrategy, {}> & IStrategy & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Strategy;
