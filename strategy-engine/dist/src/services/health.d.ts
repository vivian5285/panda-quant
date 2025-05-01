export declare const checkDatabaseHealth: () => Promise<boolean>;
export declare const checkRedisHealth: () => Promise<boolean>;
export declare const checkServerHealth: () => Promise<boolean>;
export declare function checkHealth(): Promise<{
    status: string;
    services: {
        redis: boolean;
        database: boolean;
        server: boolean;
    };
}>;
