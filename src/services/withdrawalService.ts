import { Types } from 'mongoose';
import { Withdrawal } from '../models/withdrawal';
import { UserModel } from '../models/user';

export class WithdrawalService {
  async createWithdrawal(userId: string, amount: number): Promise<any> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const withdrawal = new Withdrawal({
      userId: new Types.ObjectId(userId),
      amount,
      status: 'pending'
    });

    return await withdrawal.save();
  }

  async getWithdrawals(userId: string): Promise<any[]> {
    return await Withdrawal.find({ userId: new Types.ObjectId(userId) });
  }

  async updateWithdrawalStatus(id: string, status: string): Promise<any> {
    return await Withdrawal.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }
} 