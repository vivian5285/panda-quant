import { Document, Types } from 'mongoose';
import { IRiskEvent } from '../types/Risk';
export interface IRiskEventDocument extends IRiskEvent, Document {
    _id: Types.ObjectId;
}
export declare const RiskEvent: import("mongoose").Model<IRiskEventDocument, {}, {}, {}, Document<unknown, {}, IRiskEventDocument, {}> & IRiskEventDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=RiskEvent.d.ts.map