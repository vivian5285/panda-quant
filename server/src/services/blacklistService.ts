import { BlacklistEntry } from '../models/blacklist';
import { NotFoundError } from '../utils/errors';

export const blacklistService = {
  // 获取所有黑名单条目
  async getAllEntries(): Promise<BlacklistEntry[]> {
    return await BlacklistEntry.find().sort({ createdAt: -1 });
  },

  // 获取单个黑名单条目
  async getEntryById(id: string): Promise<BlacklistEntry> {
    const entry = await BlacklistEntry.findById(id);
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
    return entry;
  },

  // 创建黑名单条目
  async createEntry(entryData: Partial<BlacklistEntry>): Promise<BlacklistEntry> {
    const entry = new BlacklistEntry(entryData);
    return await entry.save();
  },

  // 更新黑名单条目
  async updateEntry(id: string, entryData: Partial<BlacklistEntry>): Promise<BlacklistEntry> {
    const entry = await BlacklistEntry.findByIdAndUpdate(
      id,
      { ...entryData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
    return entry;
  },

  // 删除黑名单条目
  async deleteEntry(id: string): Promise<void> {
    const entry = await BlacklistEntry.findByIdAndDelete(id);
    if (!entry) {
      throw new NotFoundError('Blacklist entry not found');
    }
  },

  // 搜索黑名单条目
  async searchEntries(query: string): Promise<BlacklistEntry[]> {
    return await BlacklistEntry.find({
      $or: [
        { userId: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { reason: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
  }
}; 