import cron from 'node-cron';
import { User } from '../../user-api/models/user.model';
import { Strategy } from '../strategies/strategy';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';
import { GridStrategy } from '../strategies/gridStrategy';
import { ScalpingStrategy } from '../strategies/scalpingStrategy';
import { StrategyPreset } from '../types';
import { ExchangeService } from '../services/exchangeService';

class StrategyExecutor {
  private exchangeService: ExchangeService;

  constructor() {
    this.exchangeService = new ExchangeService();
  }

  // 获取策略实例
  private getStrategyInstance(strategyName: string, riskLevel: string): Strategy {
    const params = StrategyPreset[riskLevel];
    
    switch (strategyName) {
      case 'superTrend':
        return new SuperTrendStrategy(params);
      case 'grid':
        return new GridStrategy(params);
      case 'scalping':
        return new ScalpingStrategy(params);
      default:
        throw new Error(`Unknown strategy: ${strategyName}`);
    }
  }

  // 执行单个用户的策略
  private async executeUserStrategy(user: any) {
    try {
      // 获取策略实例
      const strategy = this.getStrategyInstance(user.boundStrategy, user.riskLevel);

      // 获取市场数据
      const marketData = await this.exchangeService.getMarketData('BTC/USDT', '1m');

      // 分析市场并生成信号
      const signal = strategy.analyzeMarket(marketData);

      // 根据信号执行交易
      if (signal === 'buy' && !strategy.position) {
        if (user.bindType === 'recharge') {
          // 使用充值账户执行交易
          await this.exchangeService.executeTrade(
            'BTC/USDT',
            'buy',
            user.accountBalance * 0.1 // 使用10%的资金
          );
        } else if (user.bindType === 'api') {
          // 使用API执行交易
          await this.exchangeService.executeTradeWithAPI(
            'BTC/USDT',
            'buy',
            user.accountBalance * 0.1,
            user.apiKey,
            user.apiSecret
          );
        }
      } else if (signal === 'sell' && strategy.position) {
        if (user.bindType === 'recharge') {
          await this.exchangeService.executeTrade(
            'BTC/USDT',
            'sell',
            strategy.position.size
          );
        } else if (user.bindType === 'api') {
          await this.exchangeService.executeTradeWithAPI(
            'BTC/USDT',
            'sell',
            strategy.position.size,
            user.apiKey,
            user.apiSecret
          );
        }
      }

      // 更新用户账户余额
      const updatedBalance = await this.exchangeService.getAccountBalance(
        user.bindType === 'api' ? user.apiKey : undefined
      );
      
      await User.findByIdAndUpdate(user._id, {
        accountBalance: updatedBalance
      });

    } catch (error) {
      console.error(`Error executing strategy for user ${user._id}:`, error);
    }
  }

  // 执行所有用户的策略
  public async executeAllStrategies() {
    try {
      // 获取所有正在运行策略的用户
      const users = await User.find({ isStrategyRunning: true });

      // 并行执行所有用户的策略
      await Promise.all(users.map(user => this.executeUserStrategy(user)));

    } catch (error) {
      console.error('Error executing strategies:', error);
    }
  }
}

// 创建策略执行器实例
const executor = new StrategyExecutor();

// 设置定时任务，每5分钟执行一次
cron.schedule('*/5 * * * *', () => {
  console.log('Running strategy execution...');
  executor.executeAllStrategies();
});

// 导出执行器实例
export default executor; 