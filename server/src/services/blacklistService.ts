import { Types } from 'mongoose';
import { IBlacklistEntry, IBlacklistEntryDocument, BlacklistType, BlacklistStatus } from '../types/Blacklist';
import Blacklist from '../models/Blacklist.model';
import { logger } from '../utils/Logger';
import { AppError } from '../utils/AppError';

export class BlacklistService {
  private static instance: BlacklistService;

  private constructor() {}

  public static getInstance(): BlacklistService {
    if (!BlacklistService.instance) {
      BlacklistService.instance = new BlacklistService();
    }
    return BlacklistService.instance;
  }

  private convertToIBlacklistEntry(doc: IBlacklistEntryDocument): IBlacklistEntry {
    const obj = doc.toObject();
    return {
      type: obj.type as BlacklistType,
      value: obj.value,
      reason: obj.reason,
      status: obj.status as BlacklistStatus,
      address: obj.address,
      metadata: obj.metadata || {},
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt
    };
  }

  public async createBlacklistEntry(data: Omit<IBlacklistEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntry> {
    try {
      const blacklistEntry = new Blacklist(data);
      const savedEntry = await blacklistEntry.save();
      return this.convertToIBlacklistEntry(savedEntry);
    } catch (error) {
      logger.error('Error creating blacklist entry:', error);
      throw new AppError('Failed to create blacklist entry', 500);
    }
  }

  public async getBlacklistEntryById(id: string): Promise<IBlacklistEntry | null> {
    try {
      const entry = await Blacklist.findById(id);
      if (!entry) return null;
      return this.convertToIBlacklistEntry(entry);
    } catch (error) {
      logger.error('Error getting blacklist entry:', error);
      throw new AppError('Failed to get blacklist entry', 500);
    }
  }

  public async getBlacklistEntryByAddress(address: string): Promise<IBlacklistEntry | null> {
    try {
      const entry = await Blacklist.findOne({ address });
      if (!entry) return null;
      return this.convertToIBlacklistEntry(entry);
    } catch (error) {
      logger.error('Error getting blacklist entry:', error);
      throw new AppError('Failed to get blacklist entry', 500);
    }
  }

  public async updateBlacklistEntry(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntry | null> {
    try {
      const entry = await Blacklist.findByIdAndUpdate(id, data, { new: true });
      if (!entry) return null;
      return this.convertToIBlacklistEntry(entry);
    } catch (error) {
      logger.error('Error updating blacklist entry:', error);
      throw new AppError('Failed to update blacklist entry', 500);
    }
  }

  public async deleteBlacklistEntry(id: string): Promise<boolean> {
    try {
      const result = await Blacklist.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting blacklist entry:', error);
      throw new AppError('Failed to delete blacklist entry', 500);
    }
  }

  public async isBlacklisted(address: string): Promise<boolean> {
    try {
      const entry = await Blacklist.findOne({ 
        address,
        status: BlacklistStatus.ACTIVE
      });
      return entry !== null;
    } catch (error) {
      logger.error('Error checking blacklist status:', error);
      throw new AppError('Failed to check blacklist status', 500);
    }
  }

  public async getBlacklist(): Promise<IBlacklistEntry[]> {
    try {
      const entries = await Blacklist.find();
      return entries.map(entry => this.convertToIBlacklistEntry(entry));
    } catch (error) {
      logger.error('Error getting blacklist:', error);
      throw new AppError('Failed to get blacklist', 500);
    }
  }

  public async getBlacklistEntryByUserId(userId: string): Promise<IBlacklistEntry | null> {
    try {
      const entry = await Blacklist.findOne({ userId });
      if (!entry) return null;
      return this.convertToIBlacklistEntry(entry);
    } catch (error) {
      logger.error('Error getting blacklist entry:', error);
      throw new AppError('Failed to get blacklist entry', 500);
    }
  }

  public async addToBlacklist(entry: Omit<IBlacklistEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument> {
    try {
      const blacklistEntry = new Blacklist(entry);
      await blacklistEntry.save();
      return blacklistEntry;
    } catch (error) {
      logger.error('Error adding to blacklist:', error);
      throw error;
    }
  }

  public async removeFromBlacklist(id: string): Promise<void> {
    try {
      await Blacklist.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error removing from blacklist:', error);
      throw error;
    }
  }

  public async getBlacklistEntry(userId: string): Promise<IBlacklistEntryDocument | null> {
    try {
      return await Blacklist.findOne({ userId });
    } catch (error) {
      logger.error('Error getting blacklist entry:', error);
      throw error;
    }
  }

  public async getBlacklistEntries(): Promise<IBlacklistEntryDocument[]> {
    try {
      return await Blacklist.find();
    } catch (error) {
      logger.error('Error getting blacklist entries:', error);
      throw error;
    }
  }

  public async updateBlacklistEntryById(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument | null> {
    try {
      return await Blacklist.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Error updating blacklist entry by id:', error);
      throw error;
    }
  }

  async getBlacklistById(id: string): Promise<IBlacklistEntryDocument | null> {
    try {
      const blacklist = await Blacklist.findById(id);
      return blacklist;
    } catch (error) {
      logger.error('Error getting blacklist:', error);
      throw error;
    }
  }

  async getBlacklistByUserId(userId: string): Promise<IBlacklistEntryDocument | null> {
    try {
      const blacklist = await Blacklist.findOne({ userId });
      return blacklist;
    } catch (error) {
      logger.error('Error getting blacklist by userId:', error);
      throw error;
    }
  }

  async updateBlacklist(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntryDocument | null> {
    try {
      const blacklist = await Blacklist.findByIdAndUpdate(id, data, { new: true });
      return blacklist;
    } catch (error) {
      logger.error('Error updating blacklist:', error);
      throw error;
    }
  }

  async deleteBlacklist(id: string): Promise<boolean> {
    try {
      const result = await Blacklist.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting blacklist:', error);
      throw error;
    }
  }
}

export const blacklistService = BlacklistService.getInstance(); 