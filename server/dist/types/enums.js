"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeStatus = exports.OrderStatus = exports.OrderType = exports.TradeType = exports.UserStatus = exports.UserRole = exports.SettlementType = exports.SettlementStatus = exports.WithdrawalStatus = exports.CommissionStatus = exports.CommissionType = exports.RiskLevel = exports.AlertType = exports.NotificationType = exports.UserLevel = exports.StrategyStatus = exports.StrategyType = void 0;
const Trading_1 = require("./Trading");
Object.defineProperty(exports, "OrderType", { enumerable: true, get: function () { return Trading_1.OrderType; } });
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return Trading_1.OrderStatus; } });
Object.defineProperty(exports, "TradeStatus", { enumerable: true, get: function () { return Trading_1.TradeStatus; } });
var StrategyType;
(function (StrategyType) {
    StrategyType["SPOT"] = "spot";
    StrategyType["FUTURES"] = "futures";
    StrategyType["MT4"] = "mt4";
})(StrategyType || (exports.StrategyType = StrategyType = {}));
var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["PENDING"] = "pending";
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
    StrategyStatus["COMPLETED"] = "completed";
})(StrategyStatus || (exports.StrategyStatus = StrategyStatus = {}));
var UserLevel;
(function (UserLevel) {
    UserLevel["BASIC"] = "basic";
    UserLevel["PREMIUM"] = "premium";
    UserLevel["VIP"] = "vip";
})(UserLevel || (exports.UserLevel = UserLevel = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["TRADE"] = "trade";
    NotificationType["SYSTEM"] = "system";
    NotificationType["ALERT"] = "alert";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var AlertType;
(function (AlertType) {
    AlertType["PRICE"] = "price";
    AlertType["VOLUME"] = "volume";
    AlertType["TECHNICAL"] = "technical";
    AlertType["STRATEGY_LOSS"] = "strategy_loss";
    AlertType["NEWS"] = "news";
    AlertType["SYSTEM"] = "system";
})(AlertType || (exports.AlertType = AlertType = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var CommissionType;
(function (CommissionType) {
    CommissionType["FIXED"] = "fixed";
    CommissionType["PERCENTAGE"] = "percentage";
})(CommissionType || (exports.CommissionType = CommissionType = {}));
var CommissionStatus;
(function (CommissionStatus) {
    CommissionStatus["PENDING"] = "pending";
    CommissionStatus["COMPLETED"] = "completed";
    CommissionStatus["CANCELLED"] = "cancelled";
})(CommissionStatus || (exports.CommissionStatus = CommissionStatus = {}));
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["APPROVED"] = "approved";
    WithdrawalStatus["REJECTED"] = "rejected";
    WithdrawalStatus["COMPLETED"] = "completed";
    WithdrawalStatus["CANCELLED"] = "cancelled";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["PENDING"] = "pending";
    SettlementStatus["COMPLETED"] = "completed";
    SettlementStatus["FAILED"] = "failed";
})(SettlementStatus || (exports.SettlementStatus = SettlementStatus = {}));
var SettlementType;
(function (SettlementType) {
    SettlementType["COMMISSION"] = "commission";
    SettlementType["PROFIT"] = "profit";
    SettlementType["BONUS"] = "bonus";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var TradeType;
(function (TradeType) {
    TradeType["BUY"] = "buy";
    TradeType["SELL"] = "sell";
    TradeType["LONG"] = "long";
    TradeType["SHORT"] = "short";
})(TradeType || (exports.TradeType = TradeType = {}));
//# sourceMappingURL=Enums.js.map