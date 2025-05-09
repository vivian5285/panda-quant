"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistService = exports.BlacklistService = void 0;
const Blacklist_1 = require("../types/Blacklist");
const blacklist_model_1 = __importDefault(require("../models/blacklist.model"));
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
class BlacklistService {
    constructor() { }
    static getInstance() {
        if (!BlacklistService.instance) {
            BlacklistService.instance = new BlacklistService();
        }
        return BlacklistService.instance;
    }
    convertToIBlacklistEntry(doc) {
        const obj = doc.toObject();
        return {
            type: obj.type,
            value: obj.value,
            reason: obj.reason,
            status: obj.status,
            address: obj.address,
            metadata: obj.metadata || {},
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt
        };
    }
    async createBlacklistEntry(data) {
        try {
            const blacklistEntry = new blacklist_model_1.default(data);
            const savedEntry = await blacklistEntry.save();
            return this.convertToIBlacklistEntry(savedEntry);
        }
        catch (error) {
            logger_1.logger.error('Error creating blacklist entry:', error);
            throw new AppError_1.AppError('Failed to create blacklist entry', 500);
        }
    }
    async getBlacklistEntryById(id) {
        try {
            const entry = await blacklist_model_1.default.findById(id);
            if (!entry)
                return null;
            return this.convertToIBlacklistEntry(entry);
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entry:', error);
            throw new AppError_1.AppError('Failed to get blacklist entry', 500);
        }
    }
    async getBlacklistEntryByAddress(address) {
        try {
            const entry = await blacklist_model_1.default.findOne({ address });
            if (!entry)
                return null;
            return this.convertToIBlacklistEntry(entry);
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entry:', error);
            throw new AppError_1.AppError('Failed to get blacklist entry', 500);
        }
    }
    async updateBlacklistEntry(id, data) {
        try {
            const entry = await blacklist_model_1.default.findByIdAndUpdate(id, data, { new: true });
            if (!entry)
                return null;
            return this.convertToIBlacklistEntry(entry);
        }
        catch (error) {
            logger_1.logger.error('Error updating blacklist entry:', error);
            throw new AppError_1.AppError('Failed to update blacklist entry', 500);
        }
    }
    async deleteBlacklistEntry(id) {
        try {
            const result = await blacklist_model_1.default.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger_1.logger.error('Error deleting blacklist entry:', error);
            throw new AppError_1.AppError('Failed to delete blacklist entry', 500);
        }
    }
    async isBlacklisted(address) {
        try {
            const entry = await blacklist_model_1.default.findOne({
                address,
                status: Blacklist_1.BlacklistStatus.ACTIVE
            });
            return entry !== null;
        }
        catch (error) {
            logger_1.logger.error('Error checking blacklist status:', error);
            throw new AppError_1.AppError('Failed to check blacklist status', 500);
        }
    }
    async getBlacklist() {
        try {
            const entries = await blacklist_model_1.default.find();
            return entries.map(entry => this.convertToIBlacklistEntry(entry));
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist:', error);
            throw new AppError_1.AppError('Failed to get blacklist', 500);
        }
    }
    async getBlacklistEntryByUserId(userId) {
        try {
            const entry = await blacklist_model_1.default.findOne({ userId });
            if (!entry)
                return null;
            return this.convertToIBlacklistEntry(entry);
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entry:', error);
            throw new AppError_1.AppError('Failed to get blacklist entry', 500);
        }
    }
    async addToBlacklist(entry) {
        try {
            const blacklistEntry = new blacklist_model_1.default(entry);
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
            await blacklist_model_1.default.findByIdAndDelete(id);
        }
        catch (error) {
            logger_1.logger.error('Error removing from blacklist:', error);
            throw error;
        }
    }
    async getBlacklistEntry(userId) {
        try {
            return await blacklist_model_1.default.findOne({ userId });
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entry:', error);
            throw error;
        }
    }
    async getBlacklistEntries() {
        try {
            return await blacklist_model_1.default.find();
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entries:', error);
            throw error;
        }
    }
    async updateBlacklistEntryById(id, data) {
        try {
            return await blacklist_model_1.default.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error) {
            logger_1.logger.error('Error updating blacklist entry by id:', error);
            throw error;
        }
    }
    async getBlacklistById(id) {
        try {
            const blacklist = await blacklist_model_1.default.findById(id);
            return blacklist;
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist:', error);
            throw error;
        }
    }
    async getBlacklistByUserId(userId) {
        try {
            const blacklist = await blacklist_model_1.default.findOne({ userId });
            return blacklist;
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist by userId:', error);
            throw error;
        }
    }
    async updateBlacklist(id, data) {
        try {
            const blacklist = await blacklist_model_1.default.findByIdAndUpdate(id, data, { new: true });
            return blacklist;
        }
        catch (error) {
            logger_1.logger.error('Error updating blacklist:', error);
            throw error;
        }
    }
    async deleteBlacklist(id) {
        try {
            const result = await blacklist_model_1.default.findByIdAndDelete(id);
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