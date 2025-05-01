import { IBlacklistEntry } from '../types/blacklist';
import { Document } from 'mongoose';
export declare class BlacklistService {
    private static instance;
    private blacklistModel;
    private constructor();
    static getInstance(): BlacklistService;
    getAllEntries(): Promise<(IBlacklistEntry & Document)[]>;
    getEntryById(id: string): Promise<IBlacklistEntry & Document>;
    createEntry(entryData: Partial<IBlacklistEntry>): Promise<IBlacklistEntry & Document>;
    updateEntry(id: string, entryData: Partial<IBlacklistEntry>): Promise<IBlacklistEntry & Document>;
    deleteEntry(id: string): Promise<void>;
    searchEntries(query: string): Promise<(IBlacklistEntry & Document)[]>;
    addToBlacklist(data: Partial<IBlacklistEntry>): Promise<IBlacklistEntry & Document>;
    removeFromBlacklist(id: string): Promise<boolean>;
    getBlacklistEntry(id: string): Promise<(IBlacklistEntry & Document) | null>;
    getAllBlacklistEntries(): Promise<(IBlacklistEntry & Document)[]>;
    isBlacklisted(userId: string): Promise<boolean>;
    updateBlacklistEntry(id: string, data: Partial<IBlacklistEntry>): Promise<(IBlacklistEntry & Document) | null>;
}
export declare const blacklistService: BlacklistService;
