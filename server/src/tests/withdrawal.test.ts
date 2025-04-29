import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose, { Types } from 'mongoose';
import { CommissionWithdrawal, ICommissionWithdrawal } from '../models/commissionWithdrawal';
import { User } from '../models/User';
import { WithdrawalService } from '../services/withdrawalService';

describe('Withdrawal Service', () => {
  let testUser: any;
  let withdrawalService: WithdrawalService;
  let userId: Types.ObjectId;

  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');

    // Create test user
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      commissionBalance: 1000
    });
    await testUser.save();

    withdrawalService = WithdrawalService.getInstance();
    userId = new Types.ObjectId();
  });

  afterEach(async () => {
    await CommissionWithdrawal.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create withdrawal request', async () => {
    const amount = 500;
    const paymentMethod = 'bank_transfer';
    const paymentDetails = {
      accountNumber: '123456789',
      bankName: 'Test Bank',
      swiftCode: 'TEST123'
    };

    await withdrawalService.createWithdrawalRequest(
      testUser._id,
      amount,
      paymentMethod,
      paymentDetails
    );

    const withdrawal = await CommissionWithdrawal.findOne({ userId: testUser._id });
    if (!withdrawal) throw new Error('Withdrawal not found');
    
    expect(withdrawal.amount).toBe(amount);
    expect(withdrawal.status).toBe('pending');
  });

  it('should not create withdrawal request with insufficient balance', async () => {
    const amount = 1500; // More than user's balance
    const paymentMethod = 'bank_transfer';
    const paymentDetails = {
      accountNumber: '123456789',
      bankName: 'Test Bank',
      swiftCode: 'TEST123'
    };

    await expect(
      withdrawalService.createWithdrawalRequest(
        testUser._id,
        amount,
        paymentMethod,
        paymentDetails
      )
    ).rejects.toThrow('Insufficient commission balance');
  });

  it('should process withdrawal request', async () => {
    // Create withdrawal request
    const amount = 500;
    const paymentMethod = 'bank_transfer';
    const paymentDetails = {
      accountNumber: '123456789',
      bankName: 'Test Bank',
      swiftCode: 'TEST123'
    };

    await withdrawalService.createWithdrawalRequest(
      testUser._id,
      amount,
      paymentMethod,
      paymentDetails
    );

    const withdrawal = await CommissionWithdrawal.findOne({ userId: testUser._id });
    if (!withdrawal) throw new Error('Withdrawal not found');

    // Process withdrawal
    await withdrawalService.processWithdrawal(
      withdrawal._id as Types.ObjectId,
      'approved',
      'Approved by admin'
    );

    const updatedWithdrawal = await CommissionWithdrawal.findById(withdrawal._id);
    const updatedUser = await User.findById(testUser._id);
    if (!updatedWithdrawal || !updatedUser) throw new Error('Withdrawal or user not found');

    expect(updatedWithdrawal.status).toBe('approved');
    expect(updatedUser.commissionBalance).toBe(500); // 1000 - 500
  });

  it('should reject withdrawal request', async () => {
    // Create withdrawal request
    const amount = 500;
    const paymentMethod = 'bank_transfer';
    const paymentDetails = {
      accountNumber: '123456789',
      bankName: 'Test Bank',
      swiftCode: 'TEST123'
    };

    await withdrawalService.createWithdrawalRequest(
      testUser._id,
      amount,
      paymentMethod,
      paymentDetails
    );

    const withdrawal = await CommissionWithdrawal.findOne({ userId: testUser._id });
    if (!withdrawal) throw new Error('Withdrawal not found');

    // Process withdrawal
    await withdrawalService.processWithdrawal(
      withdrawal._id as Types.ObjectId,
      'rejected',
      'Invalid bank details'
    );

    const updatedWithdrawal = await CommissionWithdrawal.findById(withdrawal._id);
    const updatedUser = await User.findById(testUser._id);
    if (!updatedWithdrawal || !updatedUser) throw new Error('Withdrawal or user not found');

    expect(updatedWithdrawal.status).toBe('rejected');
    expect(updatedUser.commissionBalance).toBe(1000); // Balance should remain unchanged
  });

  it('should complete withdrawal request', async () => {
    // Create and approve withdrawal request
    const amount = 500;
    const paymentMethod = 'bank_transfer';
    const paymentDetails = {
      accountNumber: '123456789',
      bankName: 'Test Bank',
      swiftCode: 'TEST123'
    };

    await withdrawalService.createWithdrawalRequest(
      testUser._id,
      amount,
      paymentMethod,
      paymentDetails
    );

    const withdrawal = await CommissionWithdrawal.findOne({ userId: testUser._id });
    if (!withdrawal) throw new Error('Withdrawal not found');
    
    await withdrawalService.processWithdrawal(
      withdrawal._id as Types.ObjectId,
      'approved',
      'Approved by admin'
    );

    // Complete withdrawal
    await withdrawalService.completeWithdrawal(withdrawal._id as Types.ObjectId);

    const completedWithdrawal = await CommissionWithdrawal.findById(withdrawal._id);
    if (!completedWithdrawal) throw new Error('Withdrawal not found');
    
    expect(completedWithdrawal.status).toBe('completed');
  });

  it('should get withdrawal history', async () => {
    // Create multiple withdrawal requests
    const requests = [
      {
        amount: 300,
        paymentMethod: 'bank_transfer',
        paymentDetails: { accountNumber: '123456789' }
      },
      {
        amount: 200,
        paymentMethod: 'paypal',
        paymentDetails: { email: 'test@example.com' }
      }
    ];

    for (const request of requests) {
      await withdrawalService.createWithdrawalRequest(
        testUser._id,
        request.amount,
        request.paymentMethod,
        request.paymentDetails
      );
    }

    const history = await withdrawalService.getWithdrawalHistory(testUser._id);
    expect(history).toHaveLength(2);
  });

  it('should get withdrawal stats', async () => {
    // Create withdrawal requests with different statuses
    const requests = [
      { amount: 300, status: 'pending' },
      { amount: 200, status: 'approved' },
      { amount: 100, status: 'rejected' },
      { amount: 400, status: 'completed' }
    ];

    for (const request of requests) {
      const withdrawal = new CommissionWithdrawal({
        userId: testUser._id,
        amount: request.amount,
        paymentMethod: 'bank_transfer',
        paymentDetails: { accountNumber: '123456789' },
        status: request.status
      });
      await withdrawal.save();
    }

    const stats = await withdrawalService.getWithdrawalStats(testUser._id);
    expect(stats.pendingWithdrawals).toBe(1);
    expect(stats.completedWithdrawals).toBe(1);
    expect(stats.totalWithdrawn).toBe(400); // Only completed withdrawals count
  });
}); 