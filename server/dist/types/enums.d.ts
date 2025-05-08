import { OrderType, OrderStatus } from './Trading';
export declare enum StrategyType {
    TREND_FOLLOWING = "trend_following",
    MEAN_REVERSION = "mean_reversion",
    BREAKOUT = "breakout",
    SCALPING = "scalping",
    ARBITRAGE = "arbitrage",
    GRID = "grid",
    MARTINGALE = "martingale",
    CUSTOM = "custom"
}
export declare enum StrategyStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    STOPPED = "stopped",
    ERROR = "error",
    BACKTESTING = "backtesting",
    OPTIMIZING = "optimizing",
    RUNNING = "running",
    PENDING = "pending"
}
export declare enum UserLevel {
    BASIC = "basic",
    PREMIUM = "premium",
    PRO = "pro"
}
export declare enum NotificationType {
    EMAIL = "email",
    TELEGRAM = "telegram",
    WEBHOOK = "webhook",
    SMS = "sms",
    PUSH = "push"
}
export declare enum AlertType {
    TRADE = "trade",
    PERFORMANCE = "performance",
    SYSTEM = "system",
    RISK = "risk",
    CUSTOM = "custom"
}
export declare enum RiskLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    VERY_HIGH = "very_high"
}
export declare enum CommissionType {
    FIXED = "fixed",
    PERCENTAGE = "percentage",
    TIERED = "tiered"
}
export declare enum CommissionStatus {
    PENDING = "pending",
    PAID = "paid",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    COMPLETED = "completed"
}
export declare enum WithdrawalStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum SettlementStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum SettlementType {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    CUSTOM = "custom"
}
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin",
    MANAGER = "manager",
    SUPPORT = "support"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    BANNED = "banned"
}
export declare enum TradeType {
    LONG = "long",
    SHORT = "short"
}
export declare enum ReportPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    CUSTOM = "custom"
}
export { OrderType, OrderStatus };
//# sourceMappingURL=Enums.d.ts.map