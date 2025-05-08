"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeStatus = exports.OrderStatus = exports.OrderType = exports.ReportPeriod = exports.TradeType = exports.UserStatus = exports.UserRole = exports.SettlementType = exports.SettlementStatus = exports.WithdrawalStatus = exports.CommissionStatus = exports.CommissionType = exports.RiskLevel = exports.AlertType = exports.NotificationType = exports.UserLevel = exports.StrategyStatus = exports.StrategyType = void 0;
var StrategyType;
(function (StrategyType) {
    StrategyType["TREND_FOLLOWING"] = "trend_following";
    StrategyType["MEAN_REVERSION"] = "mean_reversion";
    StrategyType["BREAKOUT"] = "breakout";
    StrategyType["SCALPING"] = "scalping";
    StrategyType["ARBITRAGE"] = "arbitrage";
    StrategyType["GRID"] = "grid";
    StrategyType["MARTINGALE"] = "martingale";
    StrategyType["CUSTOM"] = "custom";
})(StrategyType || (exports.StrategyType = StrategyType = {}));
var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["PAUSED"] = "paused";
    StrategyStatus["STOPPED"] = "stopped";
    StrategyStatus["ERROR"] = "error";
    StrategyStatus["BACKTESTING"] = "backtesting";
    StrategyStatus["OPTIMIZING"] = "optimizing";
    StrategyStatus["RUNNING"] = "running";
    StrategyStatus["PENDING"] = "pending";
})(StrategyStatus || (exports.StrategyStatus = StrategyStatus = {}));
var UserLevel;
(function (UserLevel) {
    UserLevel["BASIC"] = "basic";
    UserLevel["PREMIUM"] = "premium";
    UserLevel["PRO"] = "pro";
})(UserLevel || (exports.UserLevel = UserLevel = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["TELEGRAM"] = "telegram";
    NotificationType["WEBHOOK"] = "webhook";
    NotificationType["SMS"] = "sms";
    NotificationType["PUSH"] = "push";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var AlertType;
(function (AlertType) {
    AlertType["TRADE"] = "trade";
    AlertType["PERFORMANCE"] = "performance";
    AlertType["SYSTEM"] = "system";
    AlertType["RISK"] = "risk";
    AlertType["CUSTOM"] = "custom";
})(AlertType || (exports.AlertType = AlertType = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["VERY_HIGH"] = "very_high";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var CommissionType;
(function (CommissionType) {
    CommissionType["FIXED"] = "fixed";
    CommissionType["PERCENTAGE"] = "percentage";
    CommissionType["TIERED"] = "tiered";
})(CommissionType || (exports.CommissionType = CommissionType = {}));
var CommissionStatus;
(function (CommissionStatus) {
    CommissionStatus["PENDING"] = "pending";
    CommissionStatus["PAID"] = "paid";
    CommissionStatus["CANCELLED"] = "cancelled";
    CommissionStatus["REFUNDED"] = "refunded";
    CommissionStatus["COMPLETED"] = "completed";
})(CommissionStatus || (exports.CommissionStatus = CommissionStatus = {}));
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["PROCESSING"] = "processing";
    WithdrawalStatus["COMPLETED"] = "completed";
    WithdrawalStatus["FAILED"] = "failed";
    WithdrawalStatus["CANCELLED"] = "cancelled";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["PENDING"] = "pending";
    SettlementStatus["PROCESSING"] = "processing";
    SettlementStatus["COMPLETED"] = "completed";
    SettlementStatus["FAILED"] = "failed";
    SettlementStatus["CANCELLED"] = "cancelled";
})(SettlementStatus || (exports.SettlementStatus = SettlementStatus = {}));
var SettlementType;
(function (SettlementType) {
    SettlementType["DAILY"] = "daily";
    SettlementType["WEEKLY"] = "weekly";
    SettlementType["MONTHLY"] = "monthly";
    SettlementType["CUSTOM"] = "custom";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["SUPPORT"] = "support";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["BANNED"] = "banned";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var TradeType;
(function (TradeType) {
    TradeType["LONG"] = "long";
    TradeType["SHORT"] = "short";
})(TradeType || (exports.TradeType = TradeType = {}));
var ReportPeriod;
(function (ReportPeriod) {
    ReportPeriod["DAILY"] = "daily";
    ReportPeriod["WEEKLY"] = "weekly";
    ReportPeriod["MONTHLY"] = "monthly";
    ReportPeriod["YEARLY"] = "yearly";
    ReportPeriod["CUSTOM"] = "custom";
})(ReportPeriod || (exports.ReportPeriod = ReportPeriod = {}));
var OrderType;
(function (OrderType) {
    OrderType["MARKET"] = "market";
    OrderType["LIMIT"] = "limit";
    OrderType["STOP"] = "stop";
    OrderType["STOP_LIMIT"] = "stop_limit";
})(OrderType || (exports.OrderType = OrderType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["OPEN"] = "open";
    OrderStatus["CLOSED"] = "closed";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["FAILED"] = "failed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var TradeStatus;
(function (TradeStatus) {
    TradeStatus["OPEN"] = "OPEN";
    TradeStatus["CLOSED"] = "CLOSED";
})(TradeStatus || (exports.TradeStatus = TradeStatus = {}));
//# sourceMappingURL=Enums.js.map