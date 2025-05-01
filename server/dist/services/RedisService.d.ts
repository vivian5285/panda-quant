export declare class RedisService {
    private client;
    private static instance;
    private constructor();
    static getInstance(): RedisService;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    lPush(key: string, value: string): Promise<number>;
    rPop(key: string): Promise<string | null>;
    lLen(key: string): Promise<number>;
    lIndex(key: string, index: number): Promise<string | null>;
    del(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<boolean>;
}
