import { IBlacklistEntry } from '../types/Blacklist';
export declare const blacklistValidator: import("express-validator").ValidationChain[];
export declare const validateBlacklistEntry: (entryData: Partial<IBlacklistEntry>) => string[];
