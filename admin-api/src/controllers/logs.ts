import { Request, Response } from 'express';
import { LogService, LogLevel, LogSource } from '../services/logs';

const logService = new LogService();

export const getLogs = async (_req: Request, res: Response): Promise<void> => {
    try {
        const { level, source, startDate, endDate } = _req.query;
        
        const logs = await logService.getLogs(
            level as LogLevel,
            source as LogSource,
            startDate ? new Date(startDate as string) : undefined,
            endDate ? new Date(endDate as string) : undefined
        );
        
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get logs' });
    }
};

export const getLogStats = async (_req: Request, res: Response): Promise<void> => {
    try {
        const stats = await logService.getLogStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get log stats' });
    }
};

export class LogController {
  async createLog(req: Request, res: Response): Promise<void> {
    try {
      const { level, message, source, details } = req.body;

      if (!level || !message || !source) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const log = await logService.createLog(
        level as LogLevel,
        message,
        source as LogSource,
        details
      );

      res.status(201).json(log);
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ error: 'Failed to create log' });
    }
  }
} 