export declare enum OrderType {
    MARKET = "market",
    LIMIT = "limit",
    STOP = "stop"
}
export declare enum OrderSide {
    BUY = "buy",
    SELL = "sell"
}
export declare enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    RETRYING = "retrying"
}
export interface Order {
    id: string;
    userId: string;
    strategyId: string;
    exchange: string;
    symbol: string;
    type: OrderType;
    side: OrderSide;
    amount: number;
    retryCount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}
