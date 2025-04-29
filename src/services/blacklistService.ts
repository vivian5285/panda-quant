import { Blacklist, IBlacklistEntry } from '../models/blacklist';
import { User, IUser } from '../models/user';

export class BlacklistService {
  private static instance: BlacklistService;
  private blacklistModel: typeof Blacklist;
  private userModel: typeof User;

  private constructor() {
    this.blacklistModel = Blacklist;
    this.userModel = User;
  }

  public static getInstance(): BlacklistService {
    if (!BlacklistService.instance) {
      BlacklistService.instance = new BlacklistService();
    }
    return BlacklistService.instance;
  }

  public async createBlacklistEntry(data: Partial<IBlacklistEntry>): Promise<IBlacklistEntry> {
    const blacklistEntry = new this.blacklistModel(data);
    return await blacklistEntry.save();
  }

  public async getBlacklistEntryById(id: string): Promise<IBlacklistEntry | null> {
    return await this.blacklistModel.findById(id);
  }

  public async getBlacklistEntries(): Promise<IBlacklistEntry[]> {
    return await this.blacklistModel.find();
  }

  public async updateBlacklistEntry(id: string, data: Partial<IBlacklistEntry>): Promise<IBlacklistEntry | null> {
    return await this.blacklistModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async deleteBlacklistEntry(id: string): Promise<IBlacklistEntry | null> {
    return await this.blacklistModel.findByIdAndDelete(id);
  }

  public async isUserBlacklisted(userId: string): Promise<boolean> {
    const entry = await this.blacklistModel.findOne({
      userId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });
    return !!entry;
  }
} 