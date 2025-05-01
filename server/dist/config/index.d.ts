export interface Config {
    port: number;
    mongoUri: string;
    redis: {
        url: string;
        password?: string;
    };
    api: {
        userBaseUrl: string;
        adminBaseUrl: string;
        strategyEngineUrl: string;
    };
    server: {
        env: string;
        port: number;
    };
    mongodb: {
        uri: string;
        options: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
            useCreateIndex: boolean;
            useFindAndModify: boolean;
        };
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    userApi: {
        url: string;
    };
    adminApi: {
        url: string;
    };
    strategyEngine: {
        url: string;
    };
    logging: {
        level: string;
        format: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    cache: {
        ttl: number;
        checkPeriod: number;
    };
    monitoring: {
        enabled: boolean;
        prometheus: {
            port: number;
        };
    };
}
export declare const config: Config;
