import { CommissionRule } from '../models/commissionRule';
import { UserModel } from '../models/user';
import { Order } from '../models/order';
import { CommissionService } from '../services/commissionService';

describe('Commission Service', () => {
  let commissionService: CommissionService;

  beforeEach(() => {
    commissionService = new CommissionService();
  });

  test('should create commission record', async () => {
    const record = await commissionService.createCommission({
      userId: 'test-user-id',
      amount: 1000,
      rate: 0.1
    });

    expect(record).toBeDefined();
    expect(record?.amount).toBe(1000);
    expect(record?.rate).toBe(0.1);
  });

  test('should get user commissions', async () => {
    const records = await commissionService.getUserCommissions('test-user-id');
    expect(records).toBeDefined();
    expect(Array.isArray(records)).toBe(true);
  });

  test('should update commission status', async () => {
    const record = await commissionService.createCommission({
      userId: 'test-user-id',
      amount: 1000,
      rate: 0.1
    });

    if (record) {
      const updatedRecord = await commissionService.updateCommissionStatus(record._id, 'paid');
      expect(updatedRecord).toBeDefined();
      expect(updatedRecord?.status).toBe('paid');
    }
  });
}); 