"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTracker = void 0;
class PerformanceTracker {
    constructor() {
        this.trades = [];
        this.performance = {};
    }
    addTrade(trade) {
        this.trades.push(trade);
    }
    getTrades() {
        return this.trades;
    }
    recordPerformance(metric, value) {
        this.performance[metric] = value;
    }
    getPerformance() {
        return this.performance;
    }
}
exports.PerformanceTracker = PerformanceTracker;
