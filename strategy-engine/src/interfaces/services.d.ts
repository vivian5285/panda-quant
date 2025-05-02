// 服务接口类型声明
import { Blacklist } from './models';
import { Order } from './models';
import { CommissionRule } from './models';
import { StrategyRating } from './models';
import { UserLevel } from './models';

export interface AuthService {
  login(email: string, password: string): Promise<string>;
  logout(token: string): Promise<void>;
  verifyToken(token: string): Promise<any>;
}

export interface BlacklistService {
  addToBlacklist(userId: string, reason: string): Promise<Blacklist>;
  removeFromBlacklist(userId: string): Promise<void>;
  isBlacklisted(userId: string): Promise<boolean>;
}

export interface StrategyExecutionService {
  executeStrategy(strategyId: string, params: any): Promise<void>;
  stopStrategy(strategyId: string): Promise<void>;
  getStrategyStatus(strategyId: string): Promise<any>;
}

export interface MonitoringService {
  startMonitoring(): Promise<void>;
  stopMonitoring(): Promise<void>;
  getMetrics(): Promise<any>;
}

export interface OrderQueueService {
  addOrder(order: Order): Promise<void>;
  processOrders(): Promise<void>;
  getQueueStatus(): Promise<any>;
}

export interface AlertService {
  sendAlert(message: string, level: 'info' | 'warning' | 'error'): Promise<void>;
  configureAlerts(config: any): Promise<void>;
}

export interface PerformanceTracker {
  trackPerformance(metric: string, value: number): Promise<void>;
  getPerformanceMetrics(): Promise<any>;
}

export interface RiskManagementService {
  checkRisk(order: Order): Promise<boolean>;
  updateRiskParameters(params: any): Promise<void>;
  getRiskMetrics(): Promise<any>;
}

export interface RealTimeDataService {
  subscribe(symbol: string): Promise<void>;
  unsubscribe(symbol: string): Promise<void>;
  getLatestData(symbol: string): Promise<any>;
}

export interface UserInvitationService {
  sendInvitation(email: string): Promise<void>;
  verifyInvitation(token: string): Promise<boolean>;
}

export interface PlatformStatsService {
  getStats(): Promise<any>;
  updateStats(): Promise<void>;
}

export interface CommissionService {
  calculateCommission(order: Order): Promise<number>;
  getCommissionRules(): Promise<any>;
  updateCommissionRule(rule: any): Promise<void>;
}

export interface StrategyAPIService {
  getStrategy(strategyId: string): Promise<any>;
  updateStrategy(strategyId: string, data: any): Promise<void>;
  deleteStrategy(strategyId: string): Promise<void>;
}

export interface StrategyMonitorService {
  startMonitoring(strategyId: string): Promise<void>;
  stopMonitoring(strategyId: string): Promise<void>;
  getMonitoringStatus(strategyId: string): Promise<any>;
}

export interface BacktestService {
  runBacktest(strategyId: string, params: any): Promise<any>;
  getBacktestResults(backtestId: string): Promise<any>;
}

export interface StrategyRatingService {
  rateStrategy(strategyId: string, userId: string, rating: number, comment?: string): Promise<StrategyRating>;
  getStrategyRatings(strategyId: string): Promise<StrategyRating[]>;
  getAverageRating(strategyId: string): Promise<number>;
}

export interface UserLevelService {
  getUserLevel(userId: string): Promise<UserLevel>;
  updateUserLevel(userId: string, experience: number): Promise<UserLevel>;
  getLevelRequirements(): Promise<{ level: number; experience: number }[]>;
}

export interface WithdrawalService {
  requestWithdrawal(userId: string, amount: number): Promise<any>;
  processWithdrawal(withdrawalId: string): Promise<void>;
  getWithdrawalHistory(userId: string): Promise<any[]>;
} 