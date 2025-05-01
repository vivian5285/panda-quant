"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalStatus = exports.CommissionStatus = exports.CommissionType = exports.RiskLevel = exports.AlertType = exports.StrategyStatus = exports.StrategyType = exports.TradeStatus = exports.TradeType = exports.OrderStatus = exports.OrderType = exports.Network = void 0;
const trading_1 = require("./trading");
Object.defineProperty(exports, "OrderType", { enumerable: true, get: function () { return trading_1.OrderType; } });
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return trading_1.OrderStatus; } });
// Enums
var Network;
(function (Network) {
    Network["ETHEREUM"] = "ETHEREUM";
    Network["BITCOIN"] = "BITCOIN";
    Network["BINANCE"] = "BINANCE";
})(Network || (exports.Network = Network = {}));
// Trading types
var trading_2 = require("./trading");
Object.defineProperty(exports, "TradeType", { enumerable: true, get: function () { return trading_2.TradeType; } });
Object.defineProperty(exports, "TradeStatus", { enumerable: true, get: function () { return trading_2.TradeStatus; } });
// Enum types
var enums_1 = require("./enums");
Object.defineProperty(exports, "StrategyType", { enumerable: true, get: function () { return enums_1.StrategyType; } });
Object.defineProperty(exports, "StrategyStatus", { enumerable: true, get: function () { return enums_1.StrategyStatus; } });
Object.defineProperty(exports, "AlertType", { enumerable: true, get: function () { return enums_1.AlertType; } });
Object.defineProperty(exports, "RiskLevel", { enumerable: true, get: function () { return enums_1.RiskLevel; } });
Object.defineProperty(exports, "CommissionType", { enumerable: true, get: function () { return enums_1.CommissionType; } });
Object.defineProperty(exports, "CommissionStatus", { enumerable: true, get: function () { return enums_1.CommissionStatus; } });
Object.defineProperty(exports, "WithdrawalStatus", { enumerable: true, get: function () { return enums_1.WithdrawalStatus; } });
// Other types
__exportStar(require("./transaction"), exports);
__exportStar(require("./withdrawal"), exports);
__exportStar(require("./settlement"), exports);
__exportStar(require("./notification"), exports);
__exportStar(require("./risk"), exports);
__exportStar(require("./network"), exports);
__exportStar(require("./backtest"), exports);
__exportStar(require("./express.d"), exports);
//# sourceMappingURL=index.js.map