import { Redis } from 'ioredis';
import { logger } from '../utils/logger';
import { config } from '../config';
import { AlertService } from './AlertService';

interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface AlertRule {
  id: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'neq';
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  description: string;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private redis: Redis;
  private alertService: AlertService;
  private metricsBuffer: Map<string, Metric[]> = new Map();
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 60000; // 1 minute
  private alertRules: AlertRule[] = [];

  private constructor() {
    this.redis = new Redis(config.redis);
    this.alertService = AlertService.getInstance();
    this.setupAlertRules();
    this.startFlushInterval();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private setupAlertRules(): void {
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

  private startFlushInterval(): void {
    setInterval(() => this.flushMetrics(), this.FLUSH_INTERVAL);
  }

  public async recordMetric(metric: Metric): Promise<void> {
    const key = this.getMetricKey(metric);
    if (!this.metricsBuffer.has(key)) {
      this.metricsBuffer.set(key, []);
    }

    const buffer = this.metricsBuffer.get(key)!;
    buffer.push(metric);

    if (buffer.length >= this.BUFFER_SIZE) {
      await this.flushMetrics(key);
    }

    this.checkAlerts(metric);
  }

  private getMetricKey(metric: Metric): string {
    const tags = metric.tags ? Object.entries(metric.tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join(',') : '';
    return `${metric.name}:${tags}`;
  }

  private async flushMetrics(key?: string): Promise<void> {
    const keysToFlush = key ? [key] : Array.from(this.metricsBuffer.keys());

    for (const k of keysToFlush) {
      const metrics = this.metricsBuffer.get(k);
      if (!metrics || metrics.length === 0) continue;

      const pipeline = this.redis.pipeline();
      const timestamp = Date.now();

      metrics.forEach(metric => {
        pipeline.zadd(
          `metrics:${k}`,
          metric.timestamp,
          JSON.stringify(metric)
        );
      });

      // Set TTL for the metrics
      pipeline.expire(`metrics:${k}`, 86400); // 24 hours

      try {
        await pipeline.exec();
        this.metricsBuffer.set(k, []);
      } catch (error) {
        logger.error('Error flushing metrics:', error);
      }
    }
  }

  private checkAlerts(metric: Metric): void {
    const relevantRules = this.alertRules.filter(rule => rule.metric === metric.name);

    for (const rule of relevantRules) {
      const shouldAlert = this.evaluateAlertCondition(rule, metric.value);
      if (shouldAlert) {
        this.alertService.sendAlert({
          ruleId: rule.id,
          metric: metric.name,
          value: metric.value,
          threshold: rule.threshold,
          severity: rule.severity,
          description: rule.description,
          timestamp: Date.now()
        });
      }
    }
  }

  private evaluateAlertCondition(rule: AlertRule, value: number): boolean {
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

  public async getMetrics(
    name: string,
    startTime: number,
    endTime: number,
    tags?: Record<string, string>
  ): Promise<Metric[]> {
    const key = this.getMetricKey({ name, value: 0, timestamp: 0, tags });
    const metrics = await this.redis.zrangebyscore(
      `metrics:${key}`,
      startTime,
      endTime
    );

    return metrics.map(m => JSON.parse(m));
  }

  public async getMetricStats(
    name: string,
    startTime: number,
    endTime: number,
    tags?: Record<string, string>
  ): Promise<{
    min: number;
    max: number;
    avg: number;
    count: number;
  }> {
    const metrics = await this.getMetrics(name, startTime, endTime, tags);
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
  }

  public async cleanup(): Promise<void> {
    await this.flushMetrics();
    await this.redis.quit();
  }
} 