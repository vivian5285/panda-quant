import { IBlacklistEntryDocument } from '../types/blacklist';
export declare const Blacklist: import("mongoose").Model<IBlacklistEntryDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, IBlacklistEntryDocument, {}> & IBlacklistEntryDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
