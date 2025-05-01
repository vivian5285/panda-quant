interface MarketData {
    symbol: string;
    price: number;
    volume: number;
    timestamp: number;
}
export declare class RealTimeDataService {
    private static instance;
    private ws;
    private redis;
    private subscribers;
    private reconnectAttempts;
    private readonly MAX_RECONNECT_ATTEMPTS;
    private readonly RECONNECT_DELAY;
    private readonly CACHE_TTL;
    private constructor();
    static getInstance(): RealTimeDataService;
    private connect;
    private setupWebSocketHandlers;
    private processMarketData;
    private handleReconnect;
    private subscribeToSymbols;
    getMarketData(symbol: string): Promise<MarketData | null>;
    subscribe(symbol: string, callback: (data: MarketData) => void): void;
    unsubscribe(symbol: string, callback: (data: MarketData) => void): void;
    cleanup(): Promise<void>;
}
export {};
