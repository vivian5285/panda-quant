import { OrderType, OrderStatus, TradeStatus } from './Trading';

export enum StrategyType {
  SPOT = 'spot',
  FUTURES = 'futures',
  MT4 = 'mt4'
}

export enum StrategyStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

export enum UserLevel {
  BASIC = 'basic',
  PREMIUM = 'premium',
  VIP = 'vip'
}

export enum NotificationType {
  TRADE = 'trade',
  SYSTEM = 'system',
  ALERT = 'alert'
}

export enum AlertType {
  PRICE = 'price',
  VOLUME = 'volume',
  TECHNICAL = 'technical',
  STRATEGY_LOSS = 'strategy_loss',
  NEWS = 'news',
  SYSTEM = 'system'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum CommissionType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage'
}

export enum CommissionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum SettlementStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum SettlementType {
  COMMISSION = 'commission',
  PROFIT = 'profit',
  BONUS = 'bonus'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum TradeType {
  BUY = 'buy',
  SELL = 'sell',
  LONG = 'long',
  SHORT = 'short'
}

export { OrderType, OrderStatus, TradeStatus }; 