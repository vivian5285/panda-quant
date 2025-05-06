import { Document, Types } from 'mongoose';

export enum BlacklistStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

export enum BlacklistType {
  USER = 'user',
  PHONE = 'phone',
  ADDRESS = 'address',
  IP = 'ip',
  EMAIL = 'email'
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