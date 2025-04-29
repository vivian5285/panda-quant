import { UserLevel, IUserLevel } from '../models/userLevel';
import { User, IUser } from '../models/user';

export class UserLevelService {
  private static instance: UserLevelService;
  private userLevelModel: typeof UserLevel;
  private userModel: typeof User;

  private constructor() {
    this.userLevelModel = UserLevel;
    this.userModel = User;
  }

  public static getInstance(): UserLevelService {
    if (!UserLevelService.instance) {
      UserLevelService.instance = new UserLevelService();
    }
    return UserLevelService.instance;
  }

  public async createUserLevel(data: Partial<IUserLevel>): Promise<IUserLevel> {
    const userLevel = new this.userLevelModel(data);
    return await userLevel.save();
  }

  public async getUserLevelById(id: string): Promise<IUserLevel | null> {
    return await this.userLevelModel.findById(id);
  }

  public async getUserLevels(): Promise<IUserLevel[]> {
    return await this.userLevelModel.find();
  }

  public async updateUserLevel(id: string, data: Partial<IUserLevel>): Promise<IUserLevel | null> {
    return await this.userLevelModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async deleteUserLevel(id: string): Promise<IUserLevel | null> {
    return await this.userLevelModel.findByIdAndDelete(id);
  }

  public async getUserLevelByCommission(commission: number): Promise<IUserLevel | null> {
    return await this.userLevelModel.findOne({
      minCommission: { $lte: commission },
      maxCommission: { $gt: commission }
    });
  }
} 