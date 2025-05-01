"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordRiskMetrics = exports.recordSystemMetrics = exports.recordOrderRetry = exports.recordOrderExecution = exports.recordOrder = exports.recordStrategyExecution = exports.drawdown = exports.riskExposure = exports.activeConnections = exports.cpuUsage = exports.memoryUsage = exports.orderRetryCounter = exports.orderExecutionDuration = exports.orderCounter = exports.strategyExecutionDuration = exports.strategyExecutionCounter = void 0;
const prom_client_1 = require("prom-client");
const logger_1 = require("./logger");
// 策略执行指标
exports.strategyExecutionCounter = new prom_client_1.Counter({
    name: 'strategy_execution_total',
    help: 'Total number of strategy executions',
    labelNames: ['strategy_id', 'status'],
});
exports.strategyExecutionDuration = new prom_client_1.Histogram({
    name: 'strategy_execution_duration_seconds',
    help: 'Duration of strategy executions in seconds',
    labelNames: ['strategy_id'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
});
// 订单指标
exports.orderCounter = new prom_client_1.Counter({
    name: 'order_total',
    help: 'Total number of orders',
    labelNames: ['type', 'side', 'status'],
});
exports.orderExecutionDuration = new prom_client_1.Histogram({
    name: 'order_execution_duration_seconds',
    help: 'Duration of order executions in seconds',
    labelNames: ['type', 'side'],
    buckets: [0.1, 0.5, 1, 2, 5],
});
exports.orderRetryCounter = new prom_client_1.Counter({
    name: 'order_retry_total',
    help: 'Total number of order retries',
    labelNames: ['order_id'],
});
// 性能指标
exports.memoryUsage = new prom_client_1.Gauge({
    name: 'memory_usage_bytes',
    help: 'Memory usage in bytes',
    labelNames: ['type'],
});
exports.cpuUsage = new prom_client_1.Gauge({
    name: 'cpu_usage_percent',
    help: 'CPU usage percentage',
});
exports.activeConnections = new prom_client_1.Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
});
// 风险指标
exports.riskExposure = new prom_client_1.Gauge({
    name: 'risk_exposure',
    help: 'Current risk exposure',
    labelNames: ['strategy_id'],
});
exports.drawdown = new prom_client_1.Gauge({
    name: 'drawdown_percent',
    help: 'Current drawdown percentage',
    labelNames: ['strategy_id'],
});
// 记录策略执行指标
const recordStrategyExecution = (strategyId, status, duration) => {
    exports.strategyExecutionCounter.inc({ strategy_id: strategyId, status });
    exports.strategyExecutionDuration.observe({ strategy_id: strategyId }, duration);
    (0, logger_1.logInfo)('Strategy execution recorded', { strategyId, status, duration });
};
exports.recordStrategyExecution = recordStrategyExecution;
// 记录订单指标
const recordOrder = (type, side, status) => {
    exports.orderCounter.inc({ type, side, status });
    (0, logger_1.logInfo)('Order recorded', { type, side, status });
};
exports.recordOrder = recordOrder;
// 记录订单执行时间
const recordOrderExecution = (type, side, duration) => {
    exports.orderExecutionDuration.observe({ type, side }, duration);
    (0, logger_1.logInfo)('Order execution recorded', { type, side, duration });
};
exports.recordOrderExecution = recordOrderExecution;
// 记录订单重试
const recordOrderRetry = (orderId) => {
    exports.orderRetryCounter.inc({ order_id: orderId });
    (0, logger_1.logInfo)('Order retry recorded', { orderId });
};
exports.recordOrderRetry = recordOrderRetry;
// 记录系统资源使用
const recordSystemMetrics = () => {
    const memory = process.memoryUsage();
    exports.memoryUsage.set({ type: 'heap' }, memory.heapUsed);
    exports.memoryUsage.set({ type: 'rss' }, memory.rss);
    const cpu = process.cpuUsage();
    exports.cpuUsage.set(cpu.user / 1000000); // 转换为百分比
    (0, logger_1.logInfo)('System metrics recorded', { memory, cpu });
};
exports.recordSystemMetrics = recordSystemMetrics;
// 记录风险指标
const recordRiskMetrics = (strategyId, exposure, drawdownPercent) => {
    exports.riskExposure.set({ strategy_id: strategyId }, exposure);
    exports.drawdown.set({ strategy_id: strategyId }, drawdownPercent);
    (0, logger_1.logInfo)('Risk metrics recorded', { strategyId, exposure, drawdownPercent });
};
exports.recordRiskMetrics = recordRiskMetrics;
