import { Document } from 'mongoose';
export interface IHealth extends Document {
    status: 'healthy' | 'unhealthy';
    lastChecked: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Health: import("mongoose").Model<IHealth, {}, {}, {}, Document<unknown, {}, IHealth, {}> & IHealth & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Health;
