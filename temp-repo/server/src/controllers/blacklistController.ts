import { Request, Response } from 'express';
import { blacklistService } from '../services/blacklistService';
import { validateBlacklistEntry } from '../validators/blacklistValidator';
import { handleError } from '../utils/errorHandler';

export const blacklistController = {
  // 获取所有黑名单条目
  async getAllEntries(req: Request, res: Response) {
    try {
      const entries = await blacklistService.getAllEntries();
      res.json(entries);
    } catch (error) {
      handleError(res, error);
    }
  },

  // 获取单个黑名单条目
  async getEntryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entry = await blacklistService.getEntryById(id);
      res.json(entry);
    } catch (error) {
      handleError(res, error);
    }
  },

  // 创建黑名单条目
  async createEntry(req: Request, res: Response) {
    try {
      const entryData = req.body;
      const validationError = validateBlacklistEntry(entryData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const entry = await blacklistService.createEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      handleError(res, error);
    }
  },

  // 更新黑名单条目
  async updateEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entryData = req.body;
      const validationError = validateBlacklistEntry(entryData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const entry = await blacklistService.updateEntry(id, entryData);
      res.json(entry);
    } catch (error) {
      handleError(res, error);
    }
  },

  // 删除黑名单条目
  async deleteEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await blacklistService.deleteEntry(id);
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  },

  // 搜索黑名单条目
  async searchEntries(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: '搜索关键词是必需的' });
      }

      const entries = await blacklistService.searchEntries(query);
      res.json(entries);
    } catch (error) {
      handleError(res, error);
    }
  }
}; 