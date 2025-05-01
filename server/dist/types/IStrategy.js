"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyStatus = exports.StrategyType = void 0;
var StrategyType;
(function (StrategyType) {
    StrategyType["MOMENTUM"] = "momentum";
    StrategyType["MEAN_REVERSION"] = "mean_reversion";
    StrategyType["BREAKOUT"] = "breakout";
    StrategyType["SCALPING"] = "scalping";
    StrategyType["SWING"] = "swing";
})(StrategyType || (exports.StrategyType = StrategyType = {}));
var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
})(StrategyStatus || (exports.StrategyStatus = StrategyStatus = {}));
//# sourceMappingURL=IStrategy.js.map