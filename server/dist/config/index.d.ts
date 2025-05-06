interface Config {
    env: string;
    port: number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    corsOrigins: string[];
    rateLimitWindowMs: number;
    rateLimitMax: number;
    logLevel: string;
    nodeEnv: string;
    server: {
        port: number;
    };
    mongodb: {
        uri: string;
    };
    redis: {
        url: string;
        password: string;
    };
    cache: {
        ttl: number;
    };
}
declare const config: Config;
export { config };
