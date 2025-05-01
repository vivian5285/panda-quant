import { Document, Types } from 'mongoose';
import { ICommissionRule } from '../types/commission';
export interface ICommissionRuleDocument extends Omit<ICommissionRule, '_id'>, Document {
    _id: Types.ObjectId;
}
declare const _default: import("mongoose").Model<ICommissionRuleDocument, {}, {}, {}, Document<unknown, {}, ICommissionRuleDocument, {}> & ICommissionRuleDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
