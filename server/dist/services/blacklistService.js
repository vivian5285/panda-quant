"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistService = exports.BlacklistService = void 0;
const Blacklist_1 = require("../models/Blacklist");
const blacklist_1 = require("../types/blacklist");
const logger_1 = require("../utils/logger");
class BlacklistService {
    constructor() { }
    static getInstance() {
        if (!BlacklistService.instance) {
            BlacklistService.instance = new BlacklistService();
        }
        return BlacklistService.instance;
    }
    async addToBlacklist(entry) {
        try {
            const blacklistEntry = new Blacklist_1.Blacklist(entry);
            await blacklistEntry.save();
            return blacklistEntry;
        }
        catch (error) {
            logger_1.logger.error('Error adding to blacklist:', error);
            throw error;
        }
    }
    async removeFromBlacklist(id) {
        try {
            await Blacklist_1.Blacklist.findByIdAndDelete(id);
        }
        catch (error) {
            logger_1.logger.error('Error removing from blacklist:', error);
            throw error;
        }
    }
    async getBlacklist() {
        try {
            return await Blacklist_1.Blacklist.find();
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist:', error);
            throw error;
        }
    }
    async isBlacklisted(address) {
        try {
            const entry = await Blacklist_1.Blacklist.findOne({
                address,
                status: blacklist_1.BlacklistStatus.ACTIVE
            });
            return !!entry;
        }
        catch (error) {
            logger_1.logger.error('Error checking blacklist:', error);
            throw error;
        }
    }
    async getBlacklistEntry(address) {
        try {
            return await Blacklist_1.Blacklist.findOne({ address });
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entry:', error);
            throw error;
        }
    }
    async updateBlacklistEntry(address, updates) {
        try {
            const result = await Blacklist_1.Blacklist.updateOne({ address }, { ...updates, updatedAt: new Date() });
            return result.modifiedCount > 0;
        }
        catch (error) {
            logger_1.logger.error('Error updating blacklist entry:', error);
            throw error;
        }
    }
    async getBlacklistEntries() {
        try {
            return await Blacklist_1.Blacklist.find();
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entries:', error);
            throw error;
        }
    }
    async getBlacklistEntryById(id) {
        try {
            return await Blacklist_1.Blacklist.findById(id);
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entry by id:', error);
            throw error;
        }
    }
    async updateBlacklistEntryById(id, data) {
        try {
            return await Blacklist_1.Blacklist.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error) {
            logger_1.logger.error('Error updating blacklist entry by id:', error);
            throw error;
        }
    }
    async deleteBlacklistEntry(id) {
        try {
            const result = await Blacklist_1.Blacklist.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger_1.logger.error('Error deleting blacklist entry:', error);
            throw error;
        }
    }
    async createBlacklist(data) {
        try {
            const blacklist = new Blacklist_1.Blacklist(data);
            const savedBlacklist = await blacklist.save();
            return savedBlacklist;
        }
        catch (error) {
            logger_1.logger.error('Error creating blacklist:', error);
            throw error;
        }
    }
    async getBlacklistById(id) {
        try {
            const blacklist = await Blacklist_1.Blacklist.findById(id);
            return blacklist;
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist:', error);
            throw error;
        }
    }
    async getBlacklistByAddress(address) {
        try {
            const blacklist = await Blacklist_1.Blacklist.findOne({ address });
            return blacklist;
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist by address:', error);
            throw error;
        }
    }
    async updateBlacklist(id, data) {
        try {
            const blacklist = await Blacklist_1.Blacklist.findByIdAndUpdate(id, data, { new: true });
            return blacklist;
        }
        catch (error) {
            logger_1.logger.error('Error updating blacklist:', error);
            throw error;
        }
    }
    async deleteBlacklist(id) {
        try {
            const result = await Blacklist_1.Blacklist.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger_1.logger.error('Error deleting blacklist:', error);
            throw error;
        }
    }
}
exports.BlacklistService = BlacklistService;
exports.blacklistService = BlacklistService.getInstance();
//# sourceMappingURL=BlacklistService.js.map