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
exports.blacklistController = void 0;
const BlacklistService_1 = require("../services/BlacklistService");
const errorHandler_1 = require("../utils/errorHandler");
const Blacklist_1 = require("../models/Blacklist");
const logger_1 = require("../utils/logger");
const blacklistService = BlacklistService_1.BlacklistService.getInstance();
exports.blacklistController = {
    // 获取所有黑名单条目
    getAllEntries(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entries = yield Blacklist_1.Blacklist.find();
                res.json(entries);
            }
            catch (error) {
                logger_1.logger.error('Error getting blacklist entries:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    // 获取单个黑名单条目
    getEntryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const entry = yield blacklistService.getBlacklistEntryById(id);
                if (!entry) {
                    res.status(404).json({ error: 'Entry not found' });
                    return;
                }
                res.json(entry);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    },
    // 创建黑名单条目
    createEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, reason } = req.body;
                const entry = new Blacklist_1.Blacklist({ address, reason });
                yield entry.save();
                res.status(201).json(entry);
            }
            catch (error) {
                logger_1.logger.error('Error creating blacklist entry:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    // 更新黑名单条目
    updateEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { reason } = req.body;
                const entry = yield Blacklist_1.Blacklist.findByIdAndUpdate(id, { reason }, { new: true });
                if (!entry) {
                    res.status(404).json({ error: 'Entry not found' });
                    return;
                }
                res.json(entry);
            }
            catch (error) {
                logger_1.logger.error('Error updating blacklist entry:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    // 删除黑名单条目
    deleteEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield blacklistService.deleteBlacklistEntry(id);
                if (!success) {
                    res.status(404).json({ error: 'Entry not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    },
    // 搜索黑名单条目
    searchEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                const entries = yield Blacklist_1.Blacklist.find({
                    $or: [
                        { address: { $regex: query, $options: 'i' } },
                        { reason: { $regex: query, $options: 'i' } }
                    ]
                });
                res.json(entries);
            }
            catch (error) {
                logger_1.logger.error('Error searching blacklist entries:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    // 获取单个黑名单条目
    getBlacklistEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const entry = yield blacklistService.getBlacklistEntryById(id);
                if (!entry) {
                    res.status(404).json({ error: 'Entry not found' });
                    return;
                }
                res.json(entry);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    },
    // 删除黑名单条目
    deleteBlacklistEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield blacklistService.deleteBlacklistEntry(id);
                if (!success) {
                    res.status(404).json({ error: 'Entry not found' });
                    return;
                }
                res.json({ message: 'Entry deleted successfully' });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    },
    // 更新黑名单条目
    updateBlacklistEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entry = yield blacklistService.updateBlacklistEntryById(req.params['id'], req.body);
                if (!entry) {
                    res.status(404).json({ message: 'Blacklist entry not found' });
                    return;
                }
                res.json(entry);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    },
    // 获取单个黑名单条目
    getBlacklistEntryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entry = yield blacklistService.getBlacklistEntryById(req.params['id']);
                if (!entry) {
                    res.status(404).json({ message: 'Blacklist entry not found' });
                    return;
                }
                res.json(entry);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    },
    // 删除黑名单条目
    deleteBlacklistEntryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield blacklistService.deleteBlacklistEntry(id);
                if (!success) {
                    res.status(404).json({ message: 'Blacklist entry not found' });
                    return;
                }
                res.json({ message: 'Blacklist entry deleted successfully' });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
};
//# sourceMappingURL=blacklistController.js.map