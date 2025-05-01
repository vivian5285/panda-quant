"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.OrderSide = exports.OrderType = void 0;
var OrderType;
(function (OrderType) {
    OrderType["MARKET"] = "market";
    OrderType["LIMIT"] = "limit";
    OrderType["STOP"] = "stop";
})(OrderType || (exports.OrderType = OrderType = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide["BUY"] = "buy";
    OrderSide["SELL"] = "sell";
})(OrderSide || (exports.OrderSide = OrderSide = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["FAILED"] = "failed";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["RETRYING"] = "retrying";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
