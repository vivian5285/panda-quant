import { IOrder } from '../types/IOrder';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'failed';
export declare const Order: import("mongoose").Model<IOrder, {}, {}, {}, import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
