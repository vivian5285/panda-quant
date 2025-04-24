import { Request, Response } from 'express';
import { LogService } from '../services/logs';
import { LogLevel, LogSource } from '@prisma/client';

const logService = new LogService();

export class LogController {
  async getLogs(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = req.query.search as string;
      const level = req.query.level as LogLevel;
      const source = req.query.source as LogSource;

      const result = await logService.getLogs({
        page,
        pageSize,
        search,
        level,
        source
      });

      res.json(result);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  }

  async createLog(req: Request, res: Response) {
    try {
      const { level, message, source, details } = req.body;

      if (!level || !message || !source) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const log = await logService.createLog({
        level,
        message,
        source,
        details
      });

      res.status(201).json(log);
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ error: 'Failed to create log' });
    }
  }
} 