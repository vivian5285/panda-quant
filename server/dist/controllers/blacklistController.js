"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistController = void 0;
const BlacklistService_1 = require("../services/BlacklistService");
const errorHandler_1 = require("../utils/errorHandler");
const blacklist_model_1 = __importDefault(require("../models/blacklist.model"));
const logger_1 = require("../utils/logger");
const blacklistService = BlacklistService_1.BlacklistService.getInstance();
exports.blacklistController = {
    // 获取所有黑名单条目
    async getAllEntries(_req, res) {
        try {
            const entries = await blacklist_model_1.default.find();
            res.json(entries);
        }
        catch (error) {
            logger_1.logger.error('Error getting blacklist entries:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // 获取单个黑名单条目
    async getEntryById(req, res) {
        try {
            const { id } = req.params;
            const entry = await blacklistService.getBlacklistEntryById(id);
            if (!entry) {
                res.status(404).json({ error: 'Entry not found' });
                return;
            }
            res.json(entry);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    },
    // 创建黑名单条目
    async createEntry(req, res) {
        try {
            const { address, reason } = req.body;
            const entry = new blacklist_model_1.default({ address, reason });
            await entry.save();
            res.status(201).json(entry);
        }
        catch (error) {
            logger_1.logger.error('Error creating blacklist entry:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // 更新黑名单条目
    async updateEntry(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const entry = await blacklist_model_1.default.findByIdAndUpdate(id, { reason }, { new: true });
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
    },
    // 删除黑名单条目
    async deleteEntry(req, res) {
        try {
            const { id } = req.params;
            const success = await blacklistService.deleteBlacklistEntry(id);
            if (!success) {
                res.status(404).json({ error: 'Entry not found' });
                return;
            }
            res.status(204).send({});
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    },
    // 搜索黑名单条目
    async searchEntries(req, res) {
        try {
            const { query } = req.query;
            const entries = await blacklist_model_1.default.find({
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
    },
    // 获取单个黑名单条目
    async getBlacklistEntry(req, res) {
        try {
            const { id } = req.params;
            const entry = await blacklistService.getBlacklistEntryById(id);
            if (!entry) {
                res.status(404).json({ error: 'Entry not found' });
                return;
            }
            res.json(entry);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    },
    // 删除黑名单条目
    async deleteBlacklistEntry(req, res) {
        try {
            const { id } = req.params;
            const success = await blacklistService.deleteBlacklistEntry(id);
            if (!success) {
                res.status(404).json({ error: 'Entry not found' });
                return;
            }
            res.json({ message: 'Entry deleted successfully' });
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    },
    // 更新黑名单条目
    async updateBlacklistEntry(req, res) {
        try {
            const entry = await blacklistService.updateBlacklistEntryById(req.params['id'], req.body);
            if (!entry) {
                res.status(404).json({ message: 'Blacklist entry not found' });
                return;
            }
            res.json(entry);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    },
    // 获取单个黑名单条目
    async getBlacklistEntryById(req, res) {
        try {
            const entry = await blacklistService.getBlacklistEntryById(req.params['id']);
            if (!entry) {
                res.status(404).json({ message: 'Blacklist entry not found' });
                return;
            }
            res.json(entry);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    },
    // 删除黑名单条目
    async deleteBlacklistEntryById(req, res) {
        try {
            const { id } = req.params;
            const success = await blacklistService.deleteBlacklistEntry(id);
            if (!success) {
                res.status(404).json({ message: 'Blacklist entry not found' });
                return;
            }
            res.json({ message: 'Blacklist entry deleted successfully' });
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
};
//# sourceMappingURL=BlacklistController.js.map