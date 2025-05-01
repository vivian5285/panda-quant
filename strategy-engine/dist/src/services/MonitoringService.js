"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const ioredis_1 = require("ioredis");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const AlertService_1 = require("./AlertService");
class MonitoringService {
    constructor() {
        this.metricsBuffer = new Map();
        this.BUFFER_SIZE = 100;
        this.FLUSH_INTERVAL = 60000; // 1 minute
        this.alertRules = [];
        this.redis = new ioredis_1.Redis(config_1.config.redis);
        this.alertService = AlertService_1.AlertService.getInstance();
        this.setupAlertRules();
        this.startFlushInterval();
    }
    static getInstance() {
        if (!MonitoringService.instance) {
            MonitoringService.instance = new MonitoringService();
        }
        return MonitoringService.instance;
    }
    setupAlertRules() {
        this.alertRules = [
            {
                id: 'high_cpu_usage',
                metric: 'system.cpu.usage',
                condition: 'gt',
                threshold: 80,
                severity: 'warning',
                description: 'High CPU usage detected'
            },
            {
                id: 'high_memory_usage',
                metric: 'system.memory.usage',
                condition: 'gt',
                threshold: 85,
                severity: 'warning',
                description: 'High memory usage detected'
            },
            {
                id: 'strategy_error_rate',
                metric: 'strategy.error.rate',
                condition: 'gt',
                threshold: 0.1,
                severity: 'critical',
                description: 'High strategy error rate detected'
            },
            {
                id: 'low_latency',
                metric: 'system.latency',
                condition: 'lt',
                threshold: 100,
                severity: 'info',
                description: 'Low latency detected'
            }
        ];
    }
    startFlushInterval() {
        setInterval(() => this.flushMetrics(), this.FLUSH_INTERVAL);
    }
    recordMetric(metric) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getMetricKey(metric);
            if (!this.metricsBuffer.has(key)) {
                this.metricsBuffer.set(key, []);
            }
            const buffer = this.metricsBuffer.get(key);
            buffer.push(metric);
            if (buffer.length >= this.BUFFER_SIZE) {
                yield this.flushMetrics(key);
            }
            this.checkAlerts(metric);
        });
    }
    getMetricKey(metric) {
        const tags = metric.tags ? Object.entries(metric.tags)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join(',') : '';
        return `${metric.name}:${tags}`;
    }
    flushMetrics(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keysToFlush = key ? [key] : Array.from(this.metricsBuffer.keys());
            for (const k of keysToFlush) {
                const metrics = this.metricsBuffer.get(k);
                if (!metrics || metrics.length === 0)
                    continue;
                const pipeline = this.redis.pipeline();
                const timestamp = Date.now();
                metrics.forEach(metric => {
                    pipeline.zadd(`metrics:${k}`, metric.timestamp, JSON.stringify(metric));
                });
                // Set TTL for the metrics
                pipeline.expire(`metrics:${k}`, 86400); // 24 hours
                try {
                    yield pipeline.exec();
                    this.metricsBuffer.set(k, []);
                }
                catch (error) {
                    logger_1.logger.error('Error flushing metrics:', error);
                }
            }
        });
    }
    checkAlerts(metric) {
        const relevantRules = this.alertRules.filter(rule => rule.metric === metric.name);
        for (const rule of relevantRules) {
            const shouldAlert = this.evaluateAlertCondition(rule, metric.value);
            if (shouldAlert) {
                this.alertService.sendAlert(JSON.stringify({
                    ruleId: rule.id,
                    metric: metric.name,
                    value: metric.value,
                    threshold: rule.threshold,
                    severity: rule.severity,
                    description: rule.description,
                    timestamp: Date.now()
                }));
            }
        }
    }
    evaluateAlertCondition(rule, value) {
        switch (rule.condition) {
            case 'gt':
                return value > rule.threshold;
            case 'lt':
                return value < rule.threshold;
            case 'eq':
                return value === rule.threshold;
            case 'neq':
                return value !== rule.threshold;
            default:
                return false;
        }
    }
    getMetrics(name, startTime, endTime, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getMetricKey({ name, value: 0, timestamp: 0, tags });
            const metrics = yield this.redis.zrangebyscore(`metrics:${key}`, startTime, endTime);
            return metrics.map(m => JSON.parse(m));
        });
    }
    getMetricStats(name, startTime, endTime, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const metrics = yield this.getMetrics(name, startTime, endTime, tags);
            if (metrics.length === 0) {
                return { min: 0, max: 0, avg: 0, count: 0 };
            }
            const values = metrics.map(m => m.value);
            return {
                min: Math.min(...values),
                max: Math.max(...values),
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                count: values.length
            };
        });
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.flushMetrics();
            yield this.redis.quit();
        });
    }
}
exports.MonitoringService = MonitoringService;
