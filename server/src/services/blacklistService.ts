import { BlacklistEntry, IBlacklistEntry } from '../models/blacklist';
import { NotFoundError } from '../utils/errors';

export class BlacklistService {
  private static instance: BlacklistService;

  private constructor() {}

  public static getInstance(): BlacklistService {
    if (!BlacklistService.instance) {
      BlacklistService.instance = new BlacklistService();
    }
    return BlacklistService.instance;
  }

  // 获取所有黑名单条目
  async getAllEntries(): Promise<IBlacklistEntry[]> {
    return await BlacklistEntry.find().sort({ createdAt: -1 });
  }

  // 获取单个黑名单条目
  async getEntryById(id: string): Promise<IBlacklistEntry> {
    const entry = await BlacklistEntry.findById(id);
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
    return entry;
  }

  // 创建黑名单条目
  async createEntry(entryData: Partial<IBlacklistEntry>): Promise<IBlacklistEntry> {
    const entry = new BlacklistEntry(entryData);
    return await entry.save();
  }

  // 更新黑名单条目
  async updateEntry(id: string, entryData: Partial<IBlacklistEntry>): Promise<IBlacklistEntry> {
    const entry = await BlacklistEntry.findByIdAndUpdate(
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
    const entry = await BlacklistEntry.findByIdAndDelete(id);
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
  }

  // 搜索黑名单条目
  async searchEntries(query: string): Promise<IBlacklistEntry[]> {
    return await BlacklistEntry.find({
      $or: [
        { userId: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { reason: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
  }

  async addToBlacklist(data: {
    type: string;
    value: string;
    reason: string;
    createdBy: string;
  }): Promise<IBlacklistEntry> {
    const entry = new BlacklistEntry(data);
    return entry.save();
  }

  async removeFromBlacklist(id: string): Promise<IBlacklistEntry | null> {
    return BlacklistEntry.findByIdAndDelete(id);
  }

  async getBlacklist(): Promise<IBlacklistEntry[]> {
    return BlacklistEntry.find();
  }

  async isBlacklisted(type: string, value: string): Promise<boolean> {
    const entry = await BlacklistEntry.findOne({ type, value });
    return !!entry;
  }
} 