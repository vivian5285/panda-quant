import { BlacklistEntry } from '../models/Blacklist';
import { BlacklistStatus } from '../types/Blacklist';
import { logger } from '../utils/logger';
export class BlacklistService {
    constructor() { }
    static getInstance() {
        if (!BlacklistService.instance) {
            BlacklistService.instance = new BlacklistService();
        }
        return BlacklistService.instance;
    }
    async addToBlacklist(entry) {
        try {
            const blacklistEntry = new BlacklistEntry(entry);
            await blacklistEntry.save();
            return blacklistEntry;
        }
        catch (error) {
            logger.error('Error adding to blacklist:', error);
            throw error;
        }
    }
    async removeFromBlacklist(id) {
        try {
            await BlacklistEntry.findByIdAndDelete(id);
        }
        catch (error) {
            logger.error('Error removing from blacklist:', error);
            throw error;
        }
    }
    async getBlacklist() {
        try {
            return await BlacklistEntry.find();
        }
        catch (error) {
            logger.error('Error getting blacklist:', error);
            throw error;
        }
    }
    async isBlacklisted(address) {
        try {
            const entry = await BlacklistEntry.findOne({
                address,
                status: BlacklistStatus.ACTIVE
            });
            return !!entry;
        }
        catch (error) {
            logger.error('Error checking blacklist:', error);
            throw error;
        }
    }
    async getBlacklistEntry(address) {
        try {
            return await BlacklistEntry.findOne({ address });
        }
        catch (error) {
            logger.error('Error getting blacklist entry:', error);
            throw error;
        }
    }
    async updateBlacklistEntry(address, updates) {
        try {
            const result = await BlacklistEntry.updateOne({ address }, { ...updates, updatedAt: new Date() });
            return result.modifiedCount > 0;
        }
        catch (error) {
            logger.error('Error updating blacklist entry:', error);
            throw error;
        }
    }
    async getBlacklistEntries() {
        try {
            return await BlacklistEntry.find();
        }
        catch (error) {
            logger.error('Error getting blacklist entries:', error);
            throw error;
        }
    }
    async getBlacklistEntryById(id) {
        try {
            return await BlacklistEntry.findById(id);
        }
        catch (error) {
            logger.error('Error getting blacklist entry by id:', error);
            throw error;
        }
    }
    async updateBlacklistEntryById(id, data) {
        try {
            return await BlacklistEntry.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error) {
            logger.error('Error updating blacklist entry by id:', error);
            throw error;
        }
    }
    async deleteBlacklistEntry(id) {
        try {
            const result = await BlacklistEntry.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger.error('Error deleting blacklist entry:', error);
            throw error;
        }
    }
    async createBlacklist(data) {
        try {
            const blacklist = new BlacklistEntry(data);
            const savedBlacklist = await blacklist.save();
            return savedBlacklist;
        }
        catch (error) {
            logger.error('Error creating blacklist:', error);
            throw error;
        }
    }
    async getBlacklistById(id) {
        try {
            const blacklist = await BlacklistEntry.findById(id);
            return blacklist;
        }
        catch (error) {
            logger.error('Error getting blacklist:', error);
            throw error;
        }
    }
    async getBlacklistByAddress(address) {
        try {
            const blacklist = await BlacklistEntry.findOne({ address });
            return blacklist;
        }
        catch (error) {
            logger.error('Error getting blacklist by address:', error);
            throw error;
        }
    }
    async updateBlacklist(id, data) {
        try {
            const blacklist = await BlacklistEntry.findByIdAndUpdate(id, data, { new: true });
            return blacklist;
        }
        catch (error) {
            logger.error('Error updating blacklist:', error);
            throw error;
        }
    }
    async deleteBlacklist(id) {
        try {
            const result = await BlacklistEntry.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger.error('Error deleting blacklist:', error);
            throw error;
        }
    }
}
export const blacklistService = BlacklistService.getInstance();
//# sourceMappingURL=BlacklistService.js.map