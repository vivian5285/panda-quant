interface Metric {
    name: string;
    value: number;
    timestamp: number;
    tags?: Record<string, string>;
}
export declare class MonitoringService {
    private static instance;
    private redis;
    private alertService;
    private metricsBuffer;
    private readonly BUFFER_SIZE;
    private readonly FLUSH_INTERVAL;
    private alertRules;
    private constructor();
    static getInstance(): MonitoringService;
    private setupAlertRules;
    private startFlushInterval;
    recordMetric(metric: Metric): Promise<void>;
    private getMetricKey;
    private flushMetrics;
    private checkAlerts;
    private evaluateAlertCondition;
    getMetrics(name: string, startTime: number, endTime: number, tags?: Record<string, string>): Promise<Metric[]>;
    getMetricStats(name: string, startTime: number, endTime: number, tags?: Record<string, string>): Promise<{
        min: number;
        max: number;
        avg: number;
        count: number;
    }>;
    cleanup(): Promise<void>;
}
export {};
