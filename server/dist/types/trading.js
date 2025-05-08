"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeStatus = exports.OrderStatus = exports.OrderType = void 0;
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
//# sourceMappingURL=Trading.js.map