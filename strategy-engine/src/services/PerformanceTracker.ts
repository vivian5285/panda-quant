export class PerformanceTracker {
  private trades: any[] = [];
  private performance: any = {};

  addTrade(trade: any): void {
    this.trades.push(trade);
  }

  getTrades(): any[] {
    return this.trades;
  }

  recordPerformance(metric: string, value: number): void {
    this.performance[metric] = value;
  }

  getPerformance(): any {
    return this.performance;
  }
} 