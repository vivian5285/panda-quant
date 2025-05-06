import { BlacklistService } from '../services/BlacklistService';
import { handleError } from '../utils/errorHandler';
import { BlacklistEntry } from '../models/Blacklist';
import { logger } from '../utils/logger';
const blacklistService = BlacklistService.getInstance();
export const blacklistController = {
    // 获取所有黑名单条目
    async getAllEntries(_req, res) {
        try {
            const entries = await BlacklistEntry.find();
            res.json(entries);
        }
        catch (error) {
            logger.error('Error getting blacklist entries:', error);
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
            handleError(res, error);
        }
    },
    // 创建黑名单条目
    async createEntry(req, res) {
        try {
            const { address, reason } = req.body;
            const entry = new BlacklistEntry({ address, reason });
            await entry.save();
            res.status(201).json(entry);
        }
        catch (error) {
            logger.error('Error creating blacklist entry:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // 更新黑名单条目
    async updateEntry(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const entry = await BlacklistEntry.findByIdAndUpdate(id, { reason }, { new: true });
            if (!entry) {
                res.status(404).json({ error: 'Entry not found' });
                return;
            }
            res.json(entry);
        }
        catch (error) {
            logger.error('Error updating blacklist entry:', error);
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
            res.status(204).send();
        }
        catch (error) {
            handleError(res, error);
        }
    },
    // 搜索黑名单条目
    async searchEntries(req, res) {
        try {
            const { query } = req.query;
            const entries = await BlacklistEntry.find({
                $or: [
                    { address: { $regex: query, $options: 'i' } },
                    { reason: { $regex: query, $options: 'i' } }
                ]
            });
            res.json(entries);
        }
        catch (error) {
            logger.error('Error searching blacklist entries:', error);
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
            handleError(res, error);
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
            handleError(res, error);
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
            handleError(res, error);
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
            handleError(res, error);
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
            handleError(res, error);
        }
    }
};
//# sourceMappingURL=blacklistController.js.map