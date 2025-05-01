import { OrderType, OrderStatus, TradeStatus } from './trading';
export declare enum StrategyType {
    SPOT = "spot",
    FUTURES = "futures",
    MT4 = "mt4"
}
export declare enum StrategyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused",
    COMPLETED = "completed"
}
export declare enum UserLevel {
    BASIC = "basic",
    PREMIUM = "premium",
    VIP = "vip"
}
export declare enum NotificationType {
    TRADE = "trade",
    SYSTEM = "system",
    ALERT = "alert"
}
export declare enum AlertType {
    PRICE = "price",
    VOLUME = "volume",
    TECHNICAL = "technical",
    STRATEGY_LOSS = "strategy_loss",
    NEWS = "news",
    SYSTEM = "system"
}
export declare enum RiskLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare enum CommissionType {
    FIXED = "fixed",
    PERCENTAGE = "percentage"
}
export declare enum CommissionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum WithdrawalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum SettlementStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum SettlementType {
    COMMISSION = "commission",
    PROFIT = "profit",
    BONUS = "bonus"
}
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare enum TradeType {
    BUY = "buy",
    SELL = "sell",
    LONG = "long",
    SHORT = "short"
}
export { OrderType, OrderStatus, TradeStatus };
