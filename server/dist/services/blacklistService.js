"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistService = exports.BlacklistService = void 0;
const Blacklist_1 = require("../models/Blacklist");
const Blacklist_2 = require("../types/Blacklist");
const logger_1 = require("../utils/logger");
class BlacklistService {
    constructor() { }
    static getInstance() {
        if (!BlacklistService.instance) {
            BlacklistService.instance = new BlacklistService();
        }
        return BlacklistService.instance;
    }
    addToBlacklist(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blacklistEntry = new Blacklist_1.Blacklist(entry);
                yield blacklistEntry.save();
                return blacklistEntry;
            }
            catch (error) {
                logger_1.logger.error('Error adding to blacklist:', error);
                throw error;
            }
        });
    }
    removeFromBlacklist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Blacklist_1.Blacklist.findByIdAndDelete(id);
            }
            catch (error) {
                logger_1.logger.error('Error removing from blacklist:', error);
                throw error;
            }
        });
    }
    getBlacklist() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Blacklist_1.Blacklist.find();
            }
            catch (error) {
                logger_1.logger.error('Error getting blacklist:', error);
                throw error;
            }
        });
    }
    isBlacklisted(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entry = yield Blacklist_1.Blacklist.findOne({
                    address,
                    status: Blacklist_2.BlacklistStatus.ACTIVE
                });
                return !!entry;
            }
            catch (error) {
                logger_1.logger.error('Error checking blacklist:', error);
                throw error;
            }
        });
    }
    getBlacklistEntry(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Blacklist_1.Blacklist.findOne({ address });
            }
            catch (error) {
                logger_1.logger.error('Error getting blacklist entry:', error);
                throw error;
            }
        });
    }
    updateBlacklistEntry(address, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Blacklist_1.Blacklist.updateOne({ address }, Object.assign(Object.assign({}, updates), { updatedAt: new Date() }));
                return result.modifiedCount > 0;
            }
            catch (error) {
                logger_1.logger.error('Error updating blacklist entry:', error);
                throw error;
            }
        });
    }
    getBlacklistEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Blacklist_1.Blacklist.find();
            }
            catch (error) {
                logger_1.logger.error('Error getting blacklist entries:', error);
                throw error;
            }
        });
    }
    getBlacklistEntryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Blacklist_1.Blacklist.findById(id);
            }
            catch (error) {
                logger_1.logger.error('Error getting blacklist entry by id:', error);
                throw error;
            }
        });
    }
    updateBlacklistEntryById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Blacklist_1.Blacklist.findByIdAndUpdate(id, data, { new: true });
            }
            catch (error) {
                logger_1.logger.error('Error updating blacklist entry by id:', error);
                throw error;
            }
        });
    }
    deleteBlacklistEntry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Blacklist_1.Blacklist.findByIdAndDelete(id);
                return result !== null;
            }
            catch (error) {
                logger_1.logger.error('Error deleting blacklist entry:', error);
                throw error;
            }
        });
    }
    createBlacklist(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blacklist = new Blacklist_1.Blacklist(data);
                const savedBlacklist = yield blacklist.save();
                return savedBlacklist;
            }
            catch (error) {
                logger_1.logger.error('Error creating blacklist:', error);
                throw error;
            }
        });
    }
    getBlacklistById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blacklist = yield Blacklist_1.Blacklist.findById(id);
                return blacklist;
            }
            catch (error) {
                logger_1.logger.error('Error getting blacklist:', error);
                throw error;
            }
        });
    }
    getBlacklistByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blacklist = yield Blacklist_1.Blacklist.findOne({ address });
                return blacklist;
            }
            catch (error) {
                logger_1.logger.error('Error getting blacklist by address:', error);
                throw error;
            }
        });
    }
    updateBlacklist(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blacklist = yield Blacklist_1.Blacklist.findByIdAndUpdate(id, data, { new: true });
                return blacklist;
            }
            catch (error) {
                logger_1.logger.error('Error updating blacklist:', error);
                throw error;
            }
        });
    }
    deleteBlacklist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Blacklist_1.Blacklist.findByIdAndDelete(id);
                return result !== null;
            }
            catch (error) {
                logger_1.logger.error('Error deleting blacklist:', error);
                throw error;
            }
        });
    }
}
exports.BlacklistService = BlacklistService;
exports.blacklistService = BlacklistService.getInstance();
//# sourceMappingURL=BlacklistService.js.map