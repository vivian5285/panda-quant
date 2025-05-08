import { Document, Types } from 'mongoose';
import { INetworkStatus } from '../types/Network';
export interface INetworkStatusDocument extends Omit<INetworkStatus, '_id'>, Document {
    _id: Types.ObjectId;
}
declare const _default: import("mongoose").Model<INetworkStatusDocument, {}, {}, {}, Document<unknown, {}, INetworkStatusDocument, {}> & INetworkStatusDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=NetworkStatus.d.ts.map