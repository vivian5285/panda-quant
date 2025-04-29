import { BlacklistEntry, IBlacklistEntry } from '../models/blacklist';
import { NotFoundError } from '../utils/errors';
import { Model } from 'mongoose';

export class BlacklistService {
  private static instance: BlacklistService;
  private blacklistModel: Model<IBlacklistEntry>;

  public static getInstance(): BlacklistService {
    if (!BlacklistService.instance) {
      BlacklistService.instance = new BlacklistService();
    }
    return BlacklistService.instance;
  }

  constructor() {
    this.blacklistModel = BlacklistEntry;
  }

  // 获取所有黑名单条目
  async getAllEntries(): Promise<IBlacklistEntry[]> {
    return await this.blacklistModel.find().sort({ createdAt: -1 });
  }

  // 获取单个黑名单条目
  async getEntryById(id: string): Promise<IBlacklistEntry> {
    const entry = await this.blacklistModel.findById(id);
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
    return entry;
  }

  // 创建黑名单条目
  async createEntry(entryData: Partial<IBlacklistEntry>): Promise<IBlacklistEntry> {
    const entry = new this.blacklistModel(entryData);
    return await entry.save();
  }

  // 更新黑名单条目
  async updateEntry(id: string, entryData: Partial<IBlacklistEntry>): Promise<IBlacklistEntry> {
    const entry = await this.blacklistModel.findByIdAndUpdate(
      id,
      { ...entryData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
    return entry;
  }

  // 删除黑名单条目
  async deleteEntry(id: string): Promise<void> {
    const entry = await this.blacklistModel.findByIdAndDelete(id);
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
  }

  // 搜索黑名单条目
  async searchEntries(query: string): Promise<IBlacklistEntry[]> {
    return await this.blacklistModel.find({
      $or: [
        { userId: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { reason: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
  }

  async addToBlacklist(data: {
    userId: string;
    username: string;
    email: string;
    reason: string;
    type: 'spam' | 'fraud' | 'abuse' | 'other';
    status?: 'active' | 'expired';
    expiresAt?: Date;
    notes?: string;
  }): Promise<IBlacklistEntry> {
    const entry = new this.blacklistModel({
      ...data,
      status: data.status || 'active'
    });
    return entry.save();
  }

  async removeFromBlacklist(id: string): Promise<IBlacklistEntry | null> {
    return this.blacklistModel.findByIdAndDelete(id);
  }

  async getBlacklist(): Promise<IBlacklistEntry[]> {
    return this.blacklistModel.find();
  }

  async isBlacklisted(type: string, value: string): Promise<boolean> {
    const entry = await this.blacklistModel.findOne({ type, value });
    return !!entry;
  }
}

export const blacklistService = BlacklistService.getInstance(); 