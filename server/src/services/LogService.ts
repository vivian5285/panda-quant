import { Types } from 'mongoose';
import { Log } from '../models/Log.model';
import { ILog, ILogDocument } from '../types/Log';
import { logger } from '../utils/Logger';

export class LogService {
  private static instance: LogService;

  private constructor() {}

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  private convertToILog(log: ILogDocument): ILog {
    return {
      _id: log._id,
      userId: log.userId,
      strategyId: log.strategyId,
      level: log.level,
      message: log.message,
      data: log.data,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt
    };
  }

  async createLog(logData: Omit<ILog, '_id'>): Promise<ILog> {
    try {
      const log = new Log(logData);
      const savedLog = await log.save();
      return this.convertToILog(savedLog);
    } catch (error) {
      logger.error('Error creating log:', error);
      throw error;
    }
  }

  async getLogById(id: string): Promise<ILog | null> {
    try {
      const log = await Log.findById(id);
      return log ? this.convertToILog(log) : null;
    } catch (error) {
      logger.error('Error getting log:', error);
      throw error;
    }
  }

  async getLogsByUserId(userId: string): Promise<ILog[]> {
    try {
      const logs = await Log.find({ userId: new Types.ObjectId(userId) });
      return logs.map(log => this.convertToILog(log));
    } catch (error) {
      logger.error('Error getting logs:', error);
      throw error;
    }
  }

  async getLogsByStrategyId(strategyId: string): Promise<ILog[]> {
    try {
      const logs = await Log.find({ strategyId: new Types.ObjectId(strategyId) });
      return logs.map(log => this.convertToILog(log));
    } catch (error) {
      logger.error('Error getting logs by strategy id:', error);
      throw error;
    }
  }

  async getLogsByLevel(level: string): Promise<ILog[]> {
    try {
      const logs = await Log.find({ level });
      return logs.map(log => this.convertToILog(log));
    } catch (error) {
      logger.error('Error getting logs by level:', error);
      throw error;
    }
  }

  async updateLog(id: string, data: Partial<ILog>): Promise<ILog | null> {
    try {
      const log = await Log.findByIdAndUpdate(id, data, { new: true });
      return log ? this.convertToILog(log) : null;
    } catch (error) {
      logger.error('Error updating log:', error);
      throw error;
    }
  }

  async deleteLog(id: string): Promise<boolean> {
    try {
      const result = await Log.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting log:', error);
      throw error;
    }
  }

  async clearOldLogs(days: number): Promise<void> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);
      await Log.deleteMany({ createdAt: { $lt: date } });
    } catch (error) {
      logger.error('Error clearing old logs:', error);
      throw error;
    }
  }
} 