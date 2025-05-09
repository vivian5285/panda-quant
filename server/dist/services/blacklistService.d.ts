import { IBlacklistEntry, IBlacklistEntryDocument } from '../types/Blacklist';
export declare class BlacklistService {
    private static instance;
    private constructor();
    static getInstance(): BlacklistService;
    private convertToIBlacklistEntry;
    createBlacklistEntry(data: Omit<IBlacklistEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntry>;
    getBlacklistEntryById(id: string): Promise<IBlacklistEntry | null>;
    getBlacklistEntryByAddress(address: string): Promise<IBlacklistEntry | null>;
    updateBlacklistEntry(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntry | null>;
    deleteBlacklistEntry(id: string): Promise<boolean>;
    isBlacklisted(address: string): Promise<boolean>;
    getBlacklist(): Promise<IBlacklistEntry[]>;
    getBlacklistEntryByUserId(userId: string): Promise<IBlacklistEntry | null>;
    addToBlacklist(entry: Omit<IBlacklistEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument>;
    removeFromBlacklist(id: string): Promise<void>;
    getBlacklistEntry(userId: string): Promise<IBlacklistEntryDocument | null>;
    getBlacklistEntries(): Promise<IBlacklistEntryDocument[]>;
    updateBlacklistEntryById(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument | null>;
    getBlacklistById(id: string): Promise<IBlacklistEntryDocument | null>;
    getBlacklistByUserId(userId: string): Promise<IBlacklistEntryDocument | null>;
    updateBlacklist(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument | null>;
    deleteBlacklist(id: string): Promise<boolean>;
}
export declare const blacklistService: BlacklistService;
//# sourceMappingURL=BlacklistService.d.ts.map