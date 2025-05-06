import { User } from '../models/User';
import { Transaction } from '../models/transaction.model';
import { logger } from '../utils/logger';

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

        logger.info(`Successfully deducted subscription fee for user ${user._id}`);
      } else {
        logger.warn(`Insufficient balance for user ${user._id}`);
      }
    }
  } catch (error) {
    logger.error('Error deducting fees:', error);
    throw error;
  }
} 