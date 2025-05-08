import mongoose, { Document, Types } from 'mongoose';
import { ICommissionRule } from '../types/Commission';
export interface ICommissionRuleDocument extends Omit<ICommissionRule, '_id'>, Document {
    _id: Types.ObjectId;
}
declare const _default: mongoose.Model<ICommissionRuleDocument, {}, {}, {}, mongoose.Document<unknown, {}, ICommissionRuleDocument, {}> & ICommissionRuleDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=CommissionRule.d.ts.map