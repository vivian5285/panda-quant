import { IUser } from '../models/User.model';
import User from '../models/User.model';
import { Payment } from '../models/Asset.model';

const WEEKLY_FEE = 10; // 每周固定费用

async function deductWeeklyFee() {
  try {
    console.log('🔄 Starting weekly fee deduction...');
    
    // 获取所有活跃用户
    const users = await User.find({ 
      status: { $ne: 'suspended' } 
    });

    let successCount = 0;
    let insufficientCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // 创建费用记录
        const feePayment = await Payment.create({
          userId: user._id,
          type: 'FEE',
          amount: WEEKLY_FEE,
          status: 'PENDING'
        });

        let deductionSource = '';
        let deductionAmount = 0;

        // 优先使用抵扣金
        if (user.deductionCredit >= WEEKLY_FEE) {
          user.deductionCredit -= WEEKLY_FEE;
          deductionSource = 'deductionCredit';
          deductionAmount = WEEKLY_FEE;
        } 
        // 其次使用余额
        else if (user.balance >= WEEKLY_FEE) {
          user.balance -= WEEKLY_FEE;
          deductionSource = 'balance';
          deductionAmount = WEEKLY_FEE;
        } 
        // 余额不足
        else {
          user.status = 'insufficient_balance';
          deductionSource = 'none';
          insufficientCount++;
        }

        // 更新费用记录
        feePayment.status = deductionSource === 'none' ? 'FAILED' : 'COMPLETED';
        feePayment.deductionSource = deductionSource;
        feePayment.deductionAmount = deductionAmount;
        await feePayment.save();

        // 保存用户更新
        await user.save();

        if (deductionSource !== 'none') {
          successCount++;
          console.log(`✅ User ${user.email} fee deducted from ${deductionSource}`);
        } else {
          console.log(`⚠️ User ${user.email} insufficient balance`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing user ${user.email}:`, error);
      }
    }

    console.log('📊 Weekly fee deduction summary:');
    console.log(`- Total users processed: ${users.length}`);
    console.log(`- Successful deductions: ${successCount}`);
    console.log(`- Insufficient balance: ${insufficientCount}`);
    console.log(`- Errors: ${errorCount}`);
    console.log('✅ Weekly fee deduction completed');

  } catch (error) {
    console.error('❌ Error in weekly fee deduction:', error);
    throw error;
  }
}

export default deductWeeklyFee; 