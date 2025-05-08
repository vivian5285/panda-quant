import { Document, Types } from 'mongoose';
export declare enum BlacklistStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending"
}
export declare enum BlacklistType {
    USER = "user",
    PHONE = "phone",
    ADDRESS = "address",
    IP = "ip",
    EMAIL = "email",
    SPAM = "spam"
}
export interface IBlacklistEntry {
    type: BlacklistType;
    value: string;
    reason: string;
    status: BlacklistStatus;
    address: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBlacklistEntryDocument extends IBlacklistEntry, Document {
    _id: Types.ObjectId;
}
export interface IBlacklistService {
    addToBlacklist(entry: Omit<IBlacklistEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument>;
    removeFromBlacklist(id: string): Promise<void>;
    getBlacklist(): Promise<IBlacklistEntryDocument[]>;
    isBlacklisted(address: string): Promise<boolean>;
    getBlacklistEntry(address: string): Promise<IBlacklistEntryDocument | null>;
    updateBlacklistEntry(address: string, updates: Partial<IBlacklistEntry>): Promise<boolean>;
    getBlacklistEntries(): Promise<IBlacklistEntryDocument[]>;
    getBlacklistEntryById(id: string): Promise<IBlacklistEntryDocument | null>;
    updateBlacklistEntryById(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument | null>;
    deleteBlacklistEntry(id: string): Promise<boolean>;
    createBlacklist(data: Omit<IBlacklistEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument>;
    getBlacklistById(id: string): Promise<IBlacklistEntryDocument | null>;
    getBlacklistByAddress(address: string): Promise<IBlacklistEntryDocument | null>;
    updateBlacklist(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument | null>;
    deleteBlacklist(id: string): Promise<boolean>;
}
export type IBlacklist = IBlacklistEntry;
//# sourceMappingURL=Blacklist.d.ts.map