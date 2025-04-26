import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { CommissionRule } from '../models/commissionRule';
import { CommissionRecord } from '../models/commissionRecord';
import { User } from '../models/user';
import { Order } from '../models/order';
import { commissionService } from '../services/commissionService';

describe('Commission Service', () => {
  let testUser: any;
  let testOrder: any;

  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');

    // Create test user
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      levelId: new mongoose.Types.ObjectId()
    });
    await testUser.save();

    // Create test order
    testOrder = new Order({
      userId: testUser._id,
      amount: 1000,
      status: 'completed'
    });
    await testOrder.save();
  });

  afterEach(async () => {
    await CommissionRule.deleteMany({});
    await CommissionRecord.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  it('should calculate commission based on percentage rule', async () => {
    const rule = new CommissionRule({
      name: 'Test Percentage Rule',
      type: 'percentage',
      value: 10,
      status: 'active'
    });
    await rule.save();

    const commission = await commissionService.calculateCommission(testOrder, testUser);
    expect(commission).toBe(100); // 10% of 1000
  });

  it('should calculate commission based on fixed rule', async () => {
    const rule = new CommissionRule({
      name: 'Test Fixed Rule',
      type: 'fixed',
      value: 50,
      status: 'active'
    });
    await rule.save();

    const commission = await commissionService.calculateCommission(testOrder, testUser);
    expect(commission).toBe(50);
  });

  it('should apply min/max amount constraints', async () => {
    const rule = new CommissionRule({
      name: 'Test Constrained Rule',
      type: 'percentage',
      value: 10,
      minAmount: 100,
      maxAmount: 200,
      status: 'active'
    });
    await rule.save();

    const commission = await commissionService.calculateCommission(testOrder, testUser);
    expect(commission).toBe(200); // Should be capped at maxAmount
  });

  it('should create commission record', async () => {
    const commission = 100;
    await commissionService.createCommissionRecord(testOrder, testUser, commission);

    const record = await CommissionRecord.findOne({ orderId: testOrder._id });
    expect(record).toBeDefined();
    expect(record.amount).toBe(commission);
    expect(record.status).toBe('pending');
  });

  it('should distribute commission', async () => {
    const commission = 100;
    await commissionService.createCommissionRecord(testOrder, testUser, commission);
    const record = await CommissionRecord.findOne({ orderId: testOrder._id });

    await commissionService.distributeCommission(record._id);

    const updatedRecord = await CommissionRecord.findById(record._id);
    const updatedUser = await User.findById(testUser._id);

    expect(updatedRecord.status).toBe('distributed');
    expect(updatedUser.commissionBalance).toBe(commission);
  });

  it('should get commission history', async () => {
    const commission = 100;
    await commissionService.createCommissionRecord(testOrder, testUser, commission);
    await commissionService.distributeCommission(
      (await CommissionRecord.findOne({ orderId: testOrder._id }))._id
    );

    const history = await commissionService.getCommissionHistory(testUser._id);
    expect(history).toHaveLength(1);
    expect(history[0].amount).toBe(commission);
  });

  it('should calculate total commission', async () => {
    const commission = 100;
    await commissionService.createCommissionRecord(testOrder, testUser, commission);
    await commissionService.distributeCommission(
      (await CommissionRecord.findOne({ orderId: testOrder._id }))._id
    );

    const total = await commissionService.getTotalCommission(testUser._id);
    expect(total).toBe(commission);
  });
}); 