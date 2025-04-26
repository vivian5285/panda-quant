import { Counter, Gauge, Histogram, Summary } from 'prom-client';
import { logInfo, logError } from './logger';
import { OrderStatus } from '../interfaces/order';

// 策略执行指标
export const strategyExecutionCounter = new Counter({
  name: 'strategy_execution_total',
  help: 'Total number of strategy executions',
  labelNames: ['strategy_id', 'status'],
});

export const strategyExecutionDuration = new Histogram({
  name: 'strategy_execution_duration_seconds',
  help: 'Duration of strategy executions in seconds',
  labelNames: ['strategy_id'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
});

// 订单指标
export const orderCounter = new Counter({
  name: 'order_total',
  help: 'Total number of orders',
  labelNames: ['type', 'side', 'status'],
});

export const orderExecutionDuration = new Histogram({
  name: 'order_execution_duration_seconds',
  help: 'Duration of order executions in seconds',
  labelNames: ['type', 'side'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const orderRetryCounter = new Counter({
  name: 'order_retry_total',
  help: 'Total number of order retries',
  labelNames: ['order_id'],
});

// 性能指标
export const memoryUsage = new Gauge({
  name: 'memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type'],
});

export const cpuUsage = new Gauge({
  name: 'cpu_usage_percent',
  help: 'CPU usage percentage',
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

// 风险指标
export const riskExposure = new Gauge({
  name: 'risk_exposure',
  help: 'Current risk exposure',
  labelNames: ['strategy_id'],
});

export const drawdown = new Gauge({
  name: 'drawdown_percent',
  help: 'Current drawdown percentage',
  labelNames: ['strategy_id'],
});

// 记录策略执行指标
export const recordStrategyExecution = (
  strategyId: string,
  status: string,
  duration: number
) => {
  strategyExecutionCounter.inc({ strategy_id: strategyId, status });
  strategyExecutionDuration.observe({ strategy_id: strategyId }, duration);
  logInfo('Strategy execution recorded', { strategyId, status, duration });
};

// 记录订单指标
export const recordOrder = (
  type: string,
  side: string,
  status: OrderStatus
) => {
  orderCounter.inc({ type, side, status });
  logInfo('Order recorded', { type, side, status });
};

// 记录订单执行时间
export const recordOrderExecution = (
  type: string,
  side: string,
  duration: number
) => {
  orderExecutionDuration.observe({ type, side }, duration);
  logInfo('Order execution recorded', { type, side, duration });
};

// 记录订单重试
export const recordOrderRetry = (orderId: string) => {
  orderRetryCounter.inc({ order_id: orderId });
  logInfo('Order retry recorded', { orderId });
};

// 记录系统资源使用
export const recordSystemMetrics = () => {
  const memory = process.memoryUsage();
  memoryUsage.set({ type: 'heap' }, memory.heapUsed);
  memoryUsage.set({ type: 'rss' }, memory.rss);
  
  const cpu = process.cpuUsage();
  cpuUsage.set(cpu.user / 1000000); // 转换为百分比
  
  logInfo('System metrics recorded', { memory, cpu });
};

// 记录风险指标
export const recordRiskMetrics = (
  strategyId: string,
  exposure: number,
  drawdownPercent: number
) => {
  riskExposure.set({ strategy_id: strategyId }, exposure);
  drawdown.set({ strategy_id: strategyId }, drawdownPercent);
  logInfo('Risk metrics recorded', { strategyId, exposure, drawdownPercent });
}; 