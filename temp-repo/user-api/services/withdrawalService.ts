import { DatabaseService } from './databaseService';
import { AssetService } from './assetService';

export class WithdrawalService {
  private static instance: WithdrawalService;

  private constructor() {}

  public static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  public async createWithdrawalRequest(
    userId: number,
    amount: number,
    chain: string,
    address: string
  ): Promise<number> {
    try {
      // 检查用户余额
      const userBalance = await AssetService.getUserBalance(userId);
      if (userBalance < amount) {
        throw new Error('Insufficient balance');
      }

      // 创建提现请求
      const result = await DatabaseService.query(
        `INSERT INTO withdrawal_requests 
         (user_id, amount, chain, address) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [userId, amount, chain, address]
      );

      // 冻结用户余额
      await AssetService.freezeBalance(userId, amount);

      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      throw error;
    }
  }

  public async getWithdrawalRequests(
    userId?: number,
    status?: string
  ): Promise<any[]> {
    try {
      let query = 'SELECT * FROM withdrawal_requests';
      const params: any[] = [];
      let paramCount = 0;

      if (userId) {
        query += ` WHERE user_id = $${++paramCount}`;
        params.push(userId);
      }

      if (status) {
        query += userId ? ' AND' : ' WHERE';
        query += ` status = $${++paramCount}`;
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const result = await DatabaseService.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting withdrawal requests:', error);
      throw error;
    }
  }

  public async approveWithdrawal(
    requestId: number,
    txHash: string
  ): Promise<void> {
    try {
      // 开始事务
      await DatabaseService.query('BEGIN');

      // 获取提现请求信息
      const request = await DatabaseService.query(
        'SELECT * FROM withdrawal_requests WHERE id = $1 FOR UPDATE',
        [requestId]
      );

      if (!request.rows.length) {
        throw new Error('Withdrawal request not found');
      }

      if (request.rows[0].status !== 'pending') {
        throw new Error('Withdrawal request is not pending');
      }

      // 更新提现请求状态
      await DatabaseService.query(
        `UPDATE withdrawal_requests 
         SET status = 'approved', tx_hash = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [txHash, requestId]
      );

      // 扣除用户余额
      await AssetService.deductBalance(
        request.rows[0].user_id,
        request.rows[0].amount
      );

      // 提交事务
      await DatabaseService.query('COMMIT');
    } catch (error) {
      // 回滚事务
      await DatabaseService.query('ROLLBACK');
      console.error('Error approving withdrawal:', error);
      throw error;
    }
  }

  public async rejectWithdrawal(requestId: number): Promise<void> {
    try {
      // 开始事务
      await DatabaseService.query('BEGIN');

      // 获取提现请求信息
      const request = await DatabaseService.query(
        'SELECT * FROM withdrawal_requests WHERE id = $1 FOR UPDATE',
        [requestId]
      );

      if (!request.rows.length) {
        throw new Error('Withdrawal request not found');
      }

      if (request.rows[0].status !== 'pending') {
        throw new Error('Withdrawal request is not pending');
      }

      // 更新提现请求状态
      await DatabaseService.query(
        `UPDATE withdrawal_requests 
         SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [requestId]
      );

      // 解冻用户余额
      await AssetService.unfreezeBalance(
        request.rows[0].user_id,
        request.rows[0].amount
      );

      // 提交事务
      await DatabaseService.query('COMMIT');
    } catch (error) {
      // 回滚事务
      await DatabaseService.query('ROLLBACK');
      console.error('Error rejecting withdrawal:', error);
      throw error;
    }
  }
} 