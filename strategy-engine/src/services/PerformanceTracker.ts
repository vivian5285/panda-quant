export class PerformanceTracker {
  private trades: any[] = [];

  addTrade(trade: any): void {
    this.trades.push(trade);
  }

  getTrades(): any[] {
    return this.trades;
  }
} 