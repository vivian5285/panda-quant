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
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND'
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
  TIERED = 'tiered',
  REFERRAL = 'referral',
  TRADING = 'trading',
  WITHDRAWAL = 'withdrawal'
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

export enum WithdrawalType {
  BANK = 'bank',
  CRYPTO = 'crypto',
  INTERNAL = 'internal'
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
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum OrderSide {
  BUY = 'buy',
  SELL = 'sell'
}

export enum TradeStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

export enum NetworkStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  CHECKING = 'checking'
}

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet'
}

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

export enum LogType {
  SYSTEM = 'system',
  USER = 'user',
  SECURITY = 'security',
  TRADING = 'trading'
}

export enum NotificationStatus {
  SENT = 'sent',
  FAILED = 'failed',
  PENDING = 'pending'
}

export enum TimeInForce {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK'
}

export enum MarginType {
  ISOLATED = 'isolated',
  CROSS = 'cross'
}

export enum ProfitType {
  REALIZED = 'realized',
  UNREALIZED = 'unrealized'
}

export enum ProfitStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
} 