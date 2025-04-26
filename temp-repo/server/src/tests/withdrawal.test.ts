import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { CommissionWithdrawal } from '../models/commissionWithdrawal';
import { User } from '../models/user';
import { withdrawalService } from '../services/withdrawalService';

describe('Withdrawal Service', () => {
  let testUser: any;

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
    expect(withdrawal).toBeDefined();
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

    // Process withdrawal
    await withdrawalService.processWithdrawal(withdrawal._id, 'approved', 'Approved by admin');

    const updatedWithdrawal = await CommissionWithdrawal.findById(withdrawal._id);
    const updatedUser = await User.findById(testUser._id);

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

    // Process withdrawal
    await withdrawalService.processWithdrawal(withdrawal._id, 'rejected', 'Invalid bank details');

    const updatedWithdrawal = await CommissionWithdrawal.findById(withdrawal._id);
    const updatedUser = await User.findById(testUser._id);

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
    await withdrawalService.processWithdrawal(withdrawal._id, 'approved', 'Approved by admin');

    // Complete withdrawal
    await withdrawalService.completeWithdrawal(withdrawal._id);

    const completedWithdrawal = await CommissionWithdrawal.findById(withdrawal._id);
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

    const stats = await withdrawalService.getWithdrawalStats();
    expect(stats.totalPending).toBe(1);
    expect(stats.totalApproved).toBe(1);
    expect(stats.totalRejected).toBe(1);
    expect(stats.totalCompleted).toBe(1);
    expect(stats.totalAmount).toBe(1000);
  });
}); 