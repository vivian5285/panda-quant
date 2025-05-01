import { RedisClientType } from 'redis';
export declare const redis: RedisClientType;
export declare function connectRedis(): Promise<void>;
export declare function disconnectRedis(): Promise<void>;
export declare function checkRedisHealth(): Promise<boolean>;
