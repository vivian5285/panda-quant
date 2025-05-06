/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="@/types/mongoose" />
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
    EMAIL = "email"
}
export interface IBlacklistEntry {
    type: BlacklistType;
    value: string;
    reason: string;
    status: BlacklistStatus;
    address?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBlacklistEntryDocument extends Omit<IBlacklistEntry, '_id'>, Document {
    _id: Types.ObjectId;
}
export interface IBlacklist {
    addEntry(entry: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument>;
    removeEntry(id: string): Promise<boolean>;
    isBlacklisted(value: string, type: BlacklistType): Promise<boolean>;
    getEntryById(id: string): Promise<IBlacklistEntryDocument | null>;
    getAllEntries(): Promise<IBlacklistEntryDocument[]>;
    updateEntry(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument | null>;
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
