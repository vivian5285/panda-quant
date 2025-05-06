import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose, { Types } from 'mongoose';
import { CommissionWithdrawal, ICommissionWithdrawal } from '../models/CommissionWithdrawal';
import { User } from '../models/User';
import { WithdrawalService } from '../services/WithdrawalService';
import { ICommissionWithdrawal as ICommissionWithdrawalInterface } from '../types/ICommissionWithdrawal';

describe('Withdrawal Service', () => {
  let testUser: any;
  let withdrawalService: WithdrawalService;
  let userId: Types.ObjectId;
  let testWithdrawal: ICommissionWithdrawalInterface & { _id: Types.ObjectId };

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

    const withdrawal = await withdrawalService.createWithdrawalRequest(
      testUser._id,
      amount,
      paymentMethod,
      paymentDetails
    );

    expect(withdrawal).toBeDefined();
    expect(withdrawal.userId.toString()).toBe(testUser._id.toString());
    expect(withdrawal.amount).toBe(amount);
    expect(withdrawal.status).toBe('pending');
    expect(withdrawal.paymentMethod).toBe(paymentMethod);
    expect(withdrawal.paymentDetails).toEqual(paymentDetails);

    testWithdrawal = withdrawal as ICommissionWithdrawalInterface & { _id: Types.ObjectId };
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
    const withdrawal = await withdrawalService.processWithdrawal(
      testWithdrawal._id,
      'approved',
      'Approved by admin'
    );

    expect(withdrawal).toBeDefined();
    expect(withdrawal.status).toBe('approved');
    expect(withdrawal.adminComment).toBe('Approved by admin');
  });

  it('should reject withdrawal request', async () => {
    const withdrawal = await withdrawalService.processWithdrawal(
      testWithdrawal._id,
      'rejected',
      'Invalid bank details'
    );

    expect(withdrawal).toBeDefined();
    expect(withdrawal.status).toBe('rejected');
    expect(withdrawal.adminComment).toBe('Invalid bank details');
  });

  it('should complete withdrawal request', async () => {
    const withdrawal = await withdrawalService.completeWithdrawal(testWithdrawal._id);

    expect(withdrawal).toBeDefined();
    expect(withdrawal.status).toBe('completed');
  });

  it('should get withdrawal history', async () => {
    const history = await withdrawalService.getWithdrawalHistory(testUser._id);

    expect(history).toBeDefined();
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].userId.toString()).toBe(testUser._id.toString());
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

  it('should get pending withdrawals', async () => {
    const pendingWithdrawals = await withdrawalService.getPendingWithdrawals();

    expect(pendingWithdrawals).toBeDefined();
    expect(Array.isArray(pendingWithdrawals)).toBe(true);
    pendingWithdrawals.forEach(withdrawal => {
      expect(withdrawal.status).toBe('pending');
    });
  });

  it('should get withdrawals', async () => {
    const withdrawals = await withdrawalService.getWithdrawals(testUser._id);

    expect(withdrawals).toBeDefined();
    expect(Array.isArray(withdrawals)).toBe(true);
    withdrawals.forEach(withdrawal => {
      expect(withdrawal.userId.toString()).toBe(testUser._id.toString());
    });
  });

  it('should update withdrawal status', async () => {
    const withdrawal = await withdrawalService.updateWithdrawalStatus(
      testWithdrawal._id,
      'rejected',
      'Rejected by admin'
    );

    expect(withdrawal).toBeDefined();
    expect(withdrawal.status).toBe('rejected');
    expect(withdrawal.adminComment).toBe('Rejected by admin');
  });
}); 