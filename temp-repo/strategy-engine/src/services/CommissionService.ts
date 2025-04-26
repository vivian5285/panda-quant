import { logger } from '../utils/logger';

export interface CommissionRecord {
  id: string;
  userId: string;
  type: 'platform' | 'team' | 'withdrawal';
  amount: number;
  sourceUserId?: string; // 团队返佣的来源用户ID
  generation?: number; // 团队代数（1或2）
  strategyId?: string;
  tradeId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface Wallet {
  userId: string;
  balance: number;
  frozenAmount: number; // 冻结金额（提现中）
  totalCommission: number;
  totalWithdrawal: number;
}

export class CommissionService {
  private static instance: CommissionService;
  private commissionRecords: Map<string, CommissionRecord>;
  private wallets: Map<string, Wallet>;
  private readonly PLATFORM_FEE_RATE = 0.1; // 平台托管费 10%
  private readonly FIRST_GEN_RATE = 0.2; // 第一代团队返佣 20%
  private readonly SECOND_GEN_RATE = 0.1; // 第二代团队返佣 10%

  private constructor() {
    this.commissionRecords = new Map();
    this.wallets = new Map();
  }

  public static getInstance(): CommissionService {
    if (!CommissionService.instance) {
      CommissionService.instance = new CommissionService();
    }
    return CommissionService.instance;
  }

  public async processTradeProfit(
    userId: string,
    strategyId: string,
    tradeId: string,
    profit: number
  ): Promise<void> {
    try {
      // 计算平台托管费
      const platformFee = profit * this.PLATFORM_FEE_RATE;
      const userProfit = profit - platformFee;

      // 记录平台托管费
      this.addCommissionRecord({
        id: this.generateId(),
        userId: 'platform',
        type: 'platform',
        amount: platformFee,
        sourceUserId: userId,
        strategyId,
        tradeId,
        status: 'completed',
        createdAt: new Date(),
        completedAt: new Date()
      });

      // 记录用户收益
      this.addCommissionRecord({
        id: this.generateId(),
        userId,
        type: 'team',
        amount: userProfit,
        strategyId,
        tradeId,
        status: 'completed',
        createdAt: new Date(),
        completedAt: new Date()
      });

      // 更新用户钱包
      this.updateWallet(userId, userProfit);

      // 处理团队返佣
      await this.processTeamCommission(userId, profit, strategyId, tradeId);

      logger.info(`Processed trade profit for user ${userId}, profit: ${profit}`);
    } catch (error) {
      logger.error(`Error processing trade profit: ${error}`);
      throw error;
    }
  }

  private async processTeamCommission(
    userId: string,
    profit: number,
    strategyId: string,
    tradeId: string
  ): Promise<void> {
    // TODO: 从数据库获取用户的邀请关系
    const firstGenUsers = await this.getFirstGenerationUsers(userId);
    const secondGenUsers = await this.getSecondGenerationUsers(userId);

    // 处理第一代返佣
    for (const firstGenUser of firstGenUsers) {
      const commission = profit * this.FIRST_GEN_RATE;
      this.addCommissionRecord({
        id: this.generateId(),
        userId: firstGenUser,
        type: 'team',
        amount: commission,
        sourceUserId: userId,
        generation: 1,
        strategyId,
        tradeId,
        status: 'completed',
        createdAt: new Date(),
        completedAt: new Date()
      });
      this.updateWallet(firstGenUser, commission);
    }

    // 处理第二代返佣
    for (const secondGenUser of secondGenUsers) {
      const commission = profit * this.SECOND_GEN_RATE;
      this.addCommissionRecord({
        id: this.generateId(),
        userId: secondGenUser,
        type: 'team',
        amount: commission,
        sourceUserId: userId,
        generation: 2,
        strategyId,
        tradeId,
        status: 'completed',
        createdAt: new Date(),
        completedAt: new Date()
      });
      this.updateWallet(secondGenUser, commission);
    }
  }

  public async requestWithdrawal(
    userId: string,
    amount: number
  ): Promise<CommissionRecord> {
    const wallet = this.getWallet(userId);
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const record: CommissionRecord = {
      id: this.generateId(),
      userId,
      type: 'withdrawal',
      amount: -amount,
      status: 'pending',
      createdAt: new Date()
    };

    this.addCommissionRecord(record);
    this.updateWallet(userId, -amount, true); // true 表示冻结金额

    return record;
  }

  public async completeWithdrawal(recordId: string): Promise<void> {
    const record = this.commissionRecords.get(recordId);
    if (!record || record.type !== 'withdrawal') {
      throw new Error('Invalid withdrawal record');
    }

    record.status = 'completed';
    record.completedAt = new Date();
    this.updateWallet(record.userId, 0, false, true); // 解冻金额

    logger.info(`Completed withdrawal for user ${record.userId}, amount: ${record.amount}`);
  }

  public getCommissionRecords(
    userId?: string,
    type?: CommissionRecord['type']
  ): CommissionRecord[] {
    let records = Array.from(this.commissionRecords.values());
    
    if (userId) {
      records = records.filter(record => record.userId === userId);
    }
    
    if (type) {
      records = records.filter(record => record.type === type);
    }
    
    return records;
  }

  public getWallet(userId: string): Wallet | undefined {
    return this.wallets.get(userId);
  }

  private addCommissionRecord(record: CommissionRecord): void {
    this.commissionRecords.set(record.id, record);
  }

  private updateWallet(
    userId: string,
    amount: number,
    isFrozen: boolean = false,
    isWithdrawal: boolean = false
  ): void {
    let wallet = this.wallets.get(userId);
    if (!wallet) {
      wallet = {
        userId,
        balance: 0,
        frozenAmount: 0,
        totalCommission: 0,
        totalWithdrawal: 0
      };
    }

    if (isFrozen) {
      wallet.frozenAmount += amount;
    } else {
      wallet.balance += amount;
    }

    if (amount > 0 && !isFrozen) {
      wallet.totalCommission += amount;
    }

    if (isWithdrawal) {
      wallet.totalWithdrawal += Math.abs(amount);
    }

    this.wallets.set(userId, wallet);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // TODO: 实现从数据库获取用户邀请关系的方法
  private async getFirstGenerationUsers(userId: string): Promise<string[]> {
    return []; // 从数据库获取
  }

  private async getSecondGenerationUsers(userId: string): Promise<string[]> {
    return []; // 从数据库获取
  }
} 