import { Withdrawal, IWithdrawal } from '../models/withdrawal';
import { User, IUser } from '../models/user';

export class WithdrawalService {
  private static instance: WithdrawalService;
  private withdrawalModel: typeof Withdrawal;
  private userModel: typeof User;

  private constructor() {
    this.withdrawalModel = Withdrawal;
    this.userModel = User;
  }

  public static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  public async createWithdrawal(data: Partial<IWithdrawal>): Promise<IWithdrawal> {
    const withdrawal = new this.withdrawalModel(data);
    return await withdrawal.save();
  }

  public async getWithdrawalById(id: string): Promise<IWithdrawal | null> {
    return await this.withdrawalModel.findById(id);
  }

  public async getWithdrawalsByUserId(userId: string): Promise<IWithdrawal[]> {
    return await this.withdrawalModel.find({ userId });
  }

  public async updateWithdrawalStatus(id: string, status: string): Promise<IWithdrawal | null> {
    return await this.withdrawalModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  public async deleteWithdrawal(id: string): Promise<IWithdrawal | null> {
    return await this.withdrawalModel.findByIdAndDelete(id);
  }
} 