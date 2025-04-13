import { Strategy } from '../types';
import { DatabaseService } from '../../user-api/services/databaseService';
import { ExchangeService } from './exchangeService';

export class PortfolioService {
  private databaseService: DatabaseService;
  private exchangeService: ExchangeService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.exchangeService = new ExchangeService();
  }

  public async createPortfolio(name: string, description: string): Promise<string> {
    const result = await this.databaseService.query(
      'INSERT INTO portfolios (name, description) VALUES ($1, $2) RETURNING id',
      [name, description]
    );
    return result.rows[0].id;
  }

  public async addStrategyToPortfolio(
    portfolioId: string,
    strategyId: string,
    weight: number
  ): Promise<void> {
    await this.databaseService.query(
      'INSERT INTO portfolio_strategies (portfolio_id, strategy_id, weight) VALUES ($1, $2, $3)',
      [portfolioId, strategyId, weight]
    );
  }

  public async removeStrategyFromPortfolio(portfolioId: string, strategyId: string): Promise<void> {
    await this.databaseService.query(
      'DELETE FROM portfolio_strategies WHERE portfolio_id = $1 AND strategy_id = $2',
      [portfolioId, strategyId]
    );
  }

  public async updateStrategyWeight(
    portfolioId: string,
    strategyId: string,
    weight: number
  ): Promise<void> {
    await this.databaseService.query(
      'UPDATE portfolio_strategies SET weight = $1 WHERE portfolio_id = $2 AND strategy_id = $3',
      [weight, portfolioId, strategyId]
    );
  }

  public async getPortfolioStrategies(portfolioId: string): Promise<any[]> {
    const result = await this.databaseService.query(
      'SELECT s.*, ps.weight FROM strategies s JOIN portfolio_strategies ps ON s.id = ps.strategy_id WHERE ps.portfolio_id = $1',
      [portfolioId]
    );
    return result.rows;
  }

  public async getPortfolioPerformance(portfolioId: string): Promise<any> {
    const strategies = await this.getPortfolioStrategies(portfolioId);
    const totalWeight = strategies.reduce((sum, s) => sum + s.weight, 0);
    
    let totalProfit = 0;
    let maxDrawdown = 0;
    let weightedWinRate = 0;

    for (const strategy of strategies) {
      const stats = strategy.getStats();
      const weight = strategy.weight / totalWeight;
      
      totalProfit += stats.totalProfit * weight;
      maxDrawdown = Math.max(maxDrawdown, stats.maxDrawdown);
      weightedWinRate += stats.winRate * weight;
    }

    return {
      totalProfit,
      maxDrawdown,
      winRate: weightedWinRate
    };
  }

  public async rebalancePortfolio(portfolioId: string): Promise<void> {
    const strategies = await this.getPortfolioStrategies(portfolioId);
    const totalWeight = strategies.reduce((sum, s) => sum + s.weight, 0);
    
    // 获取当前账户余额
    const balance = await this.exchangeService.getAccountBalance();
    const totalValue = Object.values(balance).reduce((sum, value) => sum + value, 0);
    
    // 计算每个策略的目标仓位
    for (const strategy of strategies) {
      const targetValue = totalValue * (strategy.weight / totalWeight);
      const currentValue = balance[strategy.symbol] || 0;
      const difference = targetValue - currentValue;
      
      if (difference > 0) {
        // 买入
        await this.exchangeService.placeOrder(
          strategy.symbol,
          'BUY',
          'MARKET',
          difference / strategy.currentPrice
        );
      } else if (difference < 0) {
        // 卖出
        await this.exchangeService.placeOrder(
          strategy.symbol,
          'SELL',
          'MARKET',
          Math.abs(difference) / strategy.currentPrice
        );
      }
    }
  }

  public async getPortfolioRiskMetrics(portfolioId: string): Promise<any> {
    const strategies = await this.getPortfolioStrategies(portfolioId);
    const returns = await this.calculateReturns(strategies);
    
    return {
      volatility: this.calculateVolatility(returns),
      sharpeRatio: this.calculateSharpeRatio(returns),
      sortinoRatio: this.calculateSortinoRatio(returns),
      correlation: this.calculateCorrelation(returns)
    };
  }

  private async calculateReturns(strategies: any[]): Promise<number[][]> {
    const returns: number[][] = [];
    
    for (const strategy of strategies) {
      const stats = strategy.getStats();
      const strategyReturns = stats.trades.map(trade => trade.profit || 0);
      returns.push(strategyReturns);
    }
    
    return returns;
  }

  private calculateVolatility(returns: number[][]): number {
    const portfolioReturns = returns[0].map((_, i) =>
      returns.reduce((sum, r) => sum + r[i], 0) / returns.length
    );
    
    const mean = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
    const variance = portfolioReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / portfolioReturns.length;
    
    return Math.sqrt(variance);
  }

  private calculateSharpeRatio(returns: number[][]): number {
    const portfolioReturns = returns[0].map((_, i) =>
      returns.reduce((sum, r) => sum + r[i], 0) / returns.length
    );
    
    const mean = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
    const volatility = this.calculateVolatility(returns);
    
    return mean / volatility;
  }

  private calculateSortinoRatio(returns: number[][]): number {
    const portfolioReturns = returns[0].map((_, i) =>
      returns.reduce((sum, r) => sum + r[i], 0) / returns.length
    );
    
    const mean = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
    const downsideReturns = portfolioReturns.filter(r => r < 0);
    const downsideVolatility = Math.sqrt(
      downsideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / downsideReturns.length
    );
    
    return mean / downsideVolatility;
  }

  private calculateCorrelation(returns: number[][]): number[][] {
    const correlations: number[][] = [];
    
    for (let i = 0; i < returns.length; i++) {
      correlations[i] = [];
      for (let j = 0; j < returns.length; j++) {
        if (i === j) {
          correlations[i][j] = 1;
        } else {
          const covariance = this.calculateCovariance(returns[i], returns[j]);
          const volatilityI = this.calculateVolatility([returns[i]]);
          const volatilityJ = this.calculateVolatility([returns[j]]);
          correlations[i][j] = covariance / (volatilityI * volatilityJ);
        }
      }
    }
    
    return correlations;
  }

  private calculateCovariance(returns1: number[], returns2: number[]): number {
    const mean1 = returns1.reduce((sum, r) => sum + r, 0) / returns1.length;
    const mean2 = returns2.reduce((sum, r) => sum + r, 0) / returns2.length;
    
    return returns1.reduce((sum, r, i) => sum + (r - mean1) * (returns2[i] - mean2), 0) / returns1.length;
  }
} 