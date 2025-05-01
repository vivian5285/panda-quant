export declare class PerformanceTracker {
    private trades;
    private performance;
    addTrade(trade: any): void;
    getTrades(): any[];
    recordPerformance(metric: string, value: number): void;
    getPerformance(): any;
}
