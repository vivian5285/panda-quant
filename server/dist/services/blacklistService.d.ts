import { IBlacklist, IBlacklistEntryDocument } from '../types/Blacklist';
export declare class BlacklistService {
    private static instance;
    private constructor();
    static getInstance(): BlacklistService;
    addToBlacklist(entry: Omit<IBlacklist, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument>;
    removeFromBlacklist(id: string): Promise<void>;
    getBlacklist(): Promise<IBlacklistEntryDocument[]>;
    isBlacklisted(address: string): Promise<boolean>;
    getBlacklistEntry(address: string): Promise<IBlacklistEntryDocument | null>;
    updateBlacklistEntry(address: string, updates: Partial<IBlacklist>): Promise<boolean>;
    getBlacklistEntries(): Promise<IBlacklistEntryDocument[]>;
    getBlacklistEntryById(id: string): Promise<IBlacklistEntryDocument | null>;
    updateBlacklistEntryById(id: string, data: Partial<IBlacklist>): Promise<IBlacklistEntryDocument | null>;
    deleteBlacklistEntry(id: string): Promise<boolean>;
    createBlacklist(data: Omit<IBlacklist, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument>;
    getBlacklistById(id: string): Promise<IBlacklistEntryDocument | null>;
    getBlacklistByAddress(address: string): Promise<IBlacklistEntryDocument | null>;
    updateBlacklist(id: string, data: Partial<IBlacklist>): Promise<IBlacklistEntryDocument | null>;
    deleteBlacklist(id: string): Promise<boolean>;
}
export declare const blacklistService: BlacklistService;
//# sourceMappingURL=BlacklistService.d.ts.map