import { Document, Types } from 'mongoose';
export declare enum BlacklistType {
    ADDRESS = "address",
    IP = "ip",
    EMAIL = "email"
}
export declare enum BlacklistStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export interface IBlacklist {
    _id?: Types.ObjectId;
    address: string;
    type: BlacklistType;
    reason: string;
    status: BlacklistStatus;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBlacklistEntry extends IBlacklist {
}
export interface IBlacklistEntryDocument extends Omit<IBlacklist, '_id'>, Document {
    _id: Types.ObjectId;
}
