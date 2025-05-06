export var OrderType;
(function (OrderType) {
    OrderType["MARKET"] = "market";
    OrderType["LIMIT"] = "limit";
    OrderType["STOP"] = "stop";
    OrderType["STOP_LIMIT"] = "stop_limit";
})(OrderType || (OrderType = {}));
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["OPEN"] = "open";
    OrderStatus["CLOSED"] = "closed";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["FAILED"] = "failed";
})(OrderStatus || (OrderStatus = {}));
export var TradeType;
(function (TradeType) {
    TradeType["SPOT"] = "spot";
    TradeType["FUTURES"] = "futures";
    TradeType["MT4"] = "mt4";
})(TradeType || (TradeType = {}));
export var TradeStatus;
(function (TradeStatus) {
    TradeStatus["OPEN"] = "open";
    TradeStatus["CLOSED"] = "closed";
    TradeStatus["CANCELLED"] = "cancelled";
})(TradeStatus || (TradeStatus = {}));
//# sourceMappingURL=Trading.js.map