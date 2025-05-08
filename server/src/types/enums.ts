export enum StrategyType {
  TREND_FOLLOWING = 'trend_following',
  MEAN_REVERSION = 'mean_reversion',
  BREAKOUT = 'breakout',
  SCALPING = 'scalping',
  ARBITRAGE = 'arbitrage',
  GRID = 'grid',
  MARTINGALE = 'martingale',
  CUSTOM = 'custom'
}

export enum StrategyStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error',
  BACKTESTING = 'backtesting',
  OPTIMIZING = 'optimizing',
  RUNNING = 'running',
  PENDING = 'pending'
}

export enum UserLevel {
  BASIC = 'basic',
  PREMIUM = 'premium',
  PRO = 'pro'
}

export enum NotificationType {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  WEBHOOK = 'webhook',
  SMS = 'sms',
  PUSH = 'push'
}

export enum AlertType {
  TRADE = 'trade',
  PERFORMANCE = 'performance',
  SYSTEM = 'system',
  RISK = 'risk',
  CUSTOM = 'custom'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum CommissionType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  TIERED = 'tiered'
}

export enum CommissionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed'
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum SettlementStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum SettlementType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPPORT = 'support'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum TradeType {
  LONG = 'long',
  SHORT = 'short'
}

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum OrderType {
  MARKET = 'market',
  LIMIT = 'limit',
  STOP = 'stop',
  STOP_LIMIT = 'stop_limit'
}

export enum OrderStatus {
  PENDING = 'pending',
  OPEN = 'open',
  FILLED = 'filled',
  PARTIALLY_FILLED = 'partially_filled',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum TradeStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
} 