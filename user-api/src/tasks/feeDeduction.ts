import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';

export async function deductFees() {
  try {
    const users = await User.find({
      subscriptionEndDate: { $gt: new Date() }
    });

    for (const user of users) {
      if (user.accountBalance >= user.subscriptionFee) {
        user.accountBalance -= user.subscriptionFee;
        await user.save();

        await Transaction.create({
          userId: user._id,
          type: 'subscription',
          amount: -user.subscriptionFee,
          status: 'completed'
        });
      }
    }
  } catch (error) {
    console.error('Error deducting fees:', error);
    throw error;
  }
} 