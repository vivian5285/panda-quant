import { describe, it, expect, beforeEach } from 'vitest';
import { WithdrawalService } from '../services/withdrawalService';
import { CommissionWithdrawal } from '../models/CommissionWithdrawal';
import { User } from '../models/User';

describe('WithdrawalService', () => {
  let withdrawalService: WithdrawalService;
  let mockUser: User;
  let mockWithdrawal: CommissionWithdrawal;

  beforeEach(() => {
    withdrawalService = new WithdrawalService();
    mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as User;

    mockWithdrawal = {
      _id: 'withdrawal123',
      userId: 'user123',
      amount: 100,
      status: 'pending',
      walletAddress: '0x123',
      createdAt: new Date(),
      updatedAt: new Date()
    } as CommissionWithdrawal;
  });

  it('should create a withdrawal request', async () => {
    const withdrawal = await withdrawalService.createWithdrawal({
      userId: mockUser._id,
      amount: 100,
      walletAddress: '0x123'
    });

    expect(withdrawal).toBeDefined();
    expect(withdrawal.userId).toBe(mockUser._id);
    expect(withdrawal.amount).toBe(100);
    expect(withdrawal.status).toBe('pending');
  });

  it('should get user withdrawals', async () => {
    const withdrawals = await withdrawalService.getUserWithdrawals(mockUser._id);
    expect(Array.isArray(withdrawals)).toBe(true);
  });

  it('should update withdrawal status', async () => {
    const updatedWithdrawal = await withdrawalService.updateWithdrawalStatus(
      mockWithdrawal._id,
      'approved'
    );

    expect(updatedWithdrawal).toBeDefined();
    expect(updatedWithdrawal.status).toBe('approved');
  });
}); 