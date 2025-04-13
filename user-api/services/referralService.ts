import { DatabaseService } from './databaseService';
import { AssetService } from './assetService';

export class ReferralService {
  private static instance: ReferralService;

  private constructor() {}

  public static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService();
    }
    return ReferralService.instance;
  }

  public async createReferral(
    userId: number,
    referralCode: string
  ): Promise<void> {
    try {
      // 获取推荐人ID
      const referrer = await DatabaseService.query(
        'SELECT id FROM users WHERE referral_code = $1',
        [referralCode]
      );

      if (!referrer.rows.length) {
        throw new Error('Invalid referral code');
      }

      const referrerId = referrer.rows[0].id;

      // 创建推荐关系
      await DatabaseService.query(
        `INSERT INTO referrals 
         (user_id, referrer_id, status) 
         VALUES ($1, $2, 'active')`,
        [userId, referrerId]
      );
    } catch (error) {
      console.error('Error creating referral:', error);
      throw error;
    }
  }

  public async calculateReferralReward(
    userId: number,
    amount: number
  ): Promise<void> {
    try {
      // 获取推荐关系
      const referral = await DatabaseService.query(
        'SELECT referrer_id FROM referrals WHERE user_id = $1 AND status = $2',
        [userId, 'active']
      );

      if (!referral.rows.length) {
        return; // 没有推荐人，不计算奖励
      }

      const referrerId = referral.rows[0].referrer_id;

      // 计算推荐奖励（假设奖励比例为5%）
      const reward = amount * 0.05;

      // 更新推荐人余额
      await AssetService.addBalance(referrerId, reward);

      // 记录推荐奖励
      await DatabaseService.query(
        `INSERT INTO referral_rewards 
         (user_id, referrer_id, amount, status) 
         VALUES ($1, $2, $3, 'pending')`,
        [userId, referrerId, reward]
      );
    } catch (error) {
      console.error('Error calculating referral reward:', error);
      throw error;
    }
  }

  public async getReferralRewards(
    userId: number,
    status?: string
  ): Promise<any[]> {
    try {
      let query = `
        SELECT 
          r.amount,
          r.status,
          r.created_at,
          u.username as referrer_username
        FROM referral_rewards r
        JOIN users u ON r.referrer_id = u.id
        WHERE r.user_id = $1
      `;
      const params: any[] = [userId];

      if (status) {
        query += ` AND r.status = $${params.length + 1}`;
        params.push(status);
      }

      query += ' ORDER BY r.created_at DESC';

      const result = await DatabaseService.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting referral rewards:', error);
      throw error;
    }
  }

  public async getReferralStats(userId: number): Promise<any> {
    try {
      const result = await DatabaseService.query(
        `SELECT 
          COUNT(*) as total_referrals,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_referrals,
          SUM(amount) as total_rewards,
          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_rewards
         FROM referral_rewards
         WHERE referrer_id = $1`,
        [userId]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error getting referral stats:', error);
      throw error;
    }
  }
} 