export interface BacktestParams {
    exchange: string;
    symbol: string;
    timeframe: string;
    startTime: string;
    endTime: string;
    initialCapital: number;
}
export interface BacktestResult {
    monthlyReturn: number;
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    trades: Trade[];
}
export interface Trade {
    timestamp: Date;
    symbol: string;
    side: 'buy' | 'sell';
    price: number;
    quantity: number;
    profit: number;
}
