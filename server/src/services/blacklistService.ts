import { BlacklistEntry } from '../models/Blacklist';
import { IBlacklist, IBlacklistEntryDocument, BlacklistStatus } from '../types/Blacklist';
import { logger } from '../utils/logger';

export class BlacklistService {
  private static instance: BlacklistService;

  private constructor() {}

  public static getInstance(): BlacklistService {
    if (!BlacklistService.instance) {
      BlacklistService.instance = new BlacklistService();
    }
    return BlacklistService.instance;
  }

  public async addToBlacklist(entry: Omit<IBlacklist, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument> {
    try {
      const blacklistEntry = new BlacklistEntry(entry);
      await blacklistEntry.save();
      return blacklistEntry;
    } catch (error) {
      logger.error('Error adding to blacklist:', error);
      throw error;
    }
  }

  public async removeFromBlacklist(id: string): Promise<void> {
    try {
      await BlacklistEntry.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error removing from blacklist:', error);
      throw error;
    }
  }

  public async getBlacklist(): Promise<IBlacklistEntryDocument[]> {
    try {
      return await BlacklistEntry.find();
    } catch (error) {
      logger.error('Error getting blacklist:', error);
      throw error;
    }
  }

  public async isBlacklisted(address: string): Promise<boolean> {
    try {
      const entry = await BlacklistEntry.findOne({ 
        address,
        status: BlacklistStatus.ACTIVE
      });
      return !!entry;
    } catch (error) {
      logger.error('Error checking blacklist:', error);
      throw error;
    }
  }

  public async getBlacklistEntry(address: string): Promise<IBlacklistEntryDocument | null> {
    try {
      return await BlacklistEntry.findOne({ address });
    } catch (error) {
      logger.error('Error getting blacklist entry:', error);
      throw error;
    }
  }

  public async updateBlacklistEntry(address: string, updates: Partial<IBlacklist>): Promise<boolean> {
    try {
      const result = await BlacklistEntry.updateOne(
        { address },
        { ...updates, updatedAt: new Date() }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      logger.error('Error updating blacklist entry:', error);
      throw error;
    }
  }

  public async getBlacklistEntries(): Promise<IBlacklistEntryDocument[]> {
    try {
      return await BlacklistEntry.find();
    } catch (error) {
      logger.error('Error getting blacklist entries:', error);
      throw error;
    }
  }

  public async getBlacklistEntryById(id: string): Promise<IBlacklistEntryDocument | null> {
    try {
      return await BlacklistEntry.findById(id);
    } catch (error) {
      logger.error('Error getting blacklist entry by id:', error);
      throw error;
    }
  }

  public async updateBlacklistEntryById(id: string, data: Partial<IBlacklist>): Promise<IBlacklistEntryDocument | null> {
    try {
      return await BlacklistEntry.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Error updating blacklist entry by id:', error);
      throw error;
    }
  }

  public async deleteBlacklistEntry(id: string): Promise<boolean> {
    try {
      const result = await BlacklistEntry.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting blacklist entry:', error);
      throw error;
    }
  }

  async createBlacklist(data: Omit<IBlacklist, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBlacklistEntryDocument> {
    try {
      const blacklist = new BlacklistEntry(data);
      const savedBlacklist = await blacklist.save();
      return savedBlacklist;
    } catch (error) {
      logger.error('Error creating blacklist:', error);
      throw error;
    }
  }

  async getBlacklistById(id: string): Promise<IBlacklistEntryDocument | null> {
    try {
      const blacklist = await BlacklistEntry.findById(id);
      return blacklist;
    } catch (error) {
      logger.error('Error getting blacklist:', error);
      throw error;
    }
  }

  async getBlacklistByAddress(address: string): Promise<IBlacklistEntryDocument | null> {
    try {
      const blacklist = await BlacklistEntry.findOne({ address });
      return blacklist;
    } catch (error) {
      logger.error('Error getting blacklist by address:', error);
      throw error;
    }
  }

  async updateBlacklist(id: string, data: Partial<IBlacklist>): Promise<IBlacklistEntryDocument | null> {
    try {
      const blacklist = await BlacklistEntry.findByIdAndUpdate(id, data, { new: true });
      return blacklist;
    } catch (error) {
      logger.error('Error updating blacklist:', error);
      throw error;
    }
  }

  async deleteBlacklist(id: string): Promise<boolean> {
    try {
      const result = await BlacklistEntry.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting blacklist:', error);
      throw error;
    }
  }
}

export const blacklistService = BlacklistService.getInstance(); 