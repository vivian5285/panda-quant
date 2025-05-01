export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    RETRYING = "retrying"
}
export declare enum OrderType {
    MARKET = "market",
    LIMIT = "limit",
    STOP = "stop",
    STOP_LIMIT = "stop_limit"
}
export declare enum OrderSide {
    BUY = "buy",
    SELL = "sell"
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
    price?: number;
    stopPrice?: number;
    status: OrderStatus;
    retryCount: number;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface OrderExecution {
    orderId: string;
    executionId: string;
    price: number;
    amount: number;
    fee: number;
    timestamp: Date;
}
export interface OrderBook {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    timestamp: Date;
}
export interface OrderBookEntry {
    price: number;
    amount: number;
}
export interface OrderFilter {
    userId?: string;
    strategyId?: string;
    status?: OrderStatus;
    type?: OrderType;
    side?: OrderSide;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}
