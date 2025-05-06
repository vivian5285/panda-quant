import { OrderType, OrderStatus, TradeStatus } from './Trading';
export var StrategyType;
(function (StrategyType) {
    StrategyType["SPOT"] = "spot";
    StrategyType["FUTURES"] = "futures";
    StrategyType["MT4"] = "mt4";
})(StrategyType || (StrategyType = {}));
export var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
    StrategyStatus["COMPLETED"] = "completed";
})(StrategyStatus || (StrategyStatus = {}));
export var UserLevel;
(function (UserLevel) {
    UserLevel["BASIC"] = "basic";
    UserLevel["PREMIUM"] = "premium";
    UserLevel["VIP"] = "vip";
})(UserLevel || (UserLevel = {}));
export var NotificationType;
(function (NotificationType) {
    NotificationType["TRADE"] = "trade";
    NotificationType["SYSTEM"] = "system";
    NotificationType["ALERT"] = "alert";
})(NotificationType || (NotificationType = {}));
export var AlertType;
(function (AlertType) {
    AlertType["PRICE"] = "price";
    AlertType["VOLUME"] = "volume";
    AlertType["TECHNICAL"] = "technical";
    AlertType["STRATEGY_LOSS"] = "strategy_loss";
    AlertType["NEWS"] = "news";
    AlertType["SYSTEM"] = "system";
})(AlertType || (AlertType = {}));
export var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
})(RiskLevel || (RiskLevel = {}));
export var CommissionType;
(function (CommissionType) {
    CommissionType["FIXED"] = "fixed";
    CommissionType["PERCENTAGE"] = "percentage";
})(CommissionType || (CommissionType = {}));
export var CommissionStatus;
(function (CommissionStatus) {
    CommissionStatus["PENDING"] = "pending";
    CommissionStatus["COMPLETED"] = "completed";
    CommissionStatus["CANCELLED"] = "cancelled";
})(CommissionStatus || (CommissionStatus = {}));
export var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["APPROVED"] = "approved";
    WithdrawalStatus["REJECTED"] = "rejected";
    WithdrawalStatus["COMPLETED"] = "completed";
    WithdrawalStatus["CANCELLED"] = "cancelled";
})(WithdrawalStatus || (WithdrawalStatus = {}));
export var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["PENDING"] = "pending";
    SettlementStatus["COMPLETED"] = "completed";
    SettlementStatus["FAILED"] = "failed";
})(SettlementStatus || (SettlementStatus = {}));
export var SettlementType;
(function (SettlementType) {
    SettlementType["COMMISSION"] = "commission";
    SettlementType["PROFIT"] = "profit";
    SettlementType["BONUS"] = "bonus";
})(SettlementType || (SettlementType = {}));
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
export var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (UserStatus = {}));
export var TradeType;
(function (TradeType) {
    TradeType["BUY"] = "buy";
    TradeType["SELL"] = "sell";
    TradeType["LONG"] = "long";
    TradeType["SHORT"] = "short";
})(TradeType || (TradeType = {}));
export { OrderType, OrderStatus, TradeStatus };
//# sourceMappingURL=Enums.js.map