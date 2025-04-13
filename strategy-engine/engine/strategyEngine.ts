import { Strategy } from '../types';
import { ExchangeService } from '../services/exchangeService';
import { logger } from '../utils/logger';
import { config } from '../config';

interface StrategyEngineOptions {
  executionInterval: number;
  maxConcurrentStrategies: number;
}

export class StrategyEngine {
  private strategies: Map<string, Strategy> = new Map();
  private exchangeService: ExchangeService;
  private isRunning: boolean = false;
  private options: StrategyEngineOptions;

  constructor(options: StrategyEngineOptions) {
    this.options = options;
    this.exchangeService = new ExchangeService(config.exchange);
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Strategy engine is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting strategy engine');

    // 启动策略执行循环
    setInterval(async () => {
      if (!this.isRunning) return;

      try {
        await this.executeStrategies();
      } catch (error) {
        logger.error('Error executing strategies:', error);
      }
    }, this.options.executionInterval);
  }

  async stop() {
    this.isRunning = false;
    logger.info('Stopping strategy engine');
  }

  registerStrategy(name: string, strategyClass: new (params: any) => Strategy) {
    if (this.strategies.size >= this.options.maxConcurrentStrategies) {
      throw new Error('Maximum number of concurrent strategies reached');
    }

    const strategy = new strategyClass(config.strategies[name]);
    this.strategies.set(name, strategy);
    logger.info(`Registered strategy: ${name}`);
  }

  private async executeStrategies() {
    const strategies = Array.from(this.strategies.values());
    const executions = strategies.map(async (strategy) => {
      try {
        // 获取市场数据
        const marketData = await this.exchangeService.getMarketData(
          strategy.symbol,
          strategy.timeframe
        );

        // 分析市场并执行交易
        const signal = await strategy.analyzeMarket(marketData);
        if (signal !== 'hold') {
          await strategy.executeTrade(signal, marketData[marketData.length - 1].close);
        }

        // 更新策略统计信息
        const stats = strategy.getStats();
        logger.info(`Strategy ${strategy.id} stats:`, stats);
      } catch (error) {
        logger.error(`Error executing strategy ${strategy.id}:`, error);
      }
    });

 