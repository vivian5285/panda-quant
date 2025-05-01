export declare class RedisService {
    private static instance;
    private client;
    private constructor();
    static getInstance(): RedisService;
    lpush(key: string, value: string): Promise<number>;
    rpop(key: string): Promise<string | null>;
    llen(key: string): Promise<number>;
    lindex(key: string, index: number): Promise<string | null>;
    del(key: string): Promise<number>;
}
