export declare const config: {
    mongodb: {
        uri: string;
        options: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
        };
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
    };
    api: {
        port: number;
        jwtSecret: string;
    };
    strategy: {
        maxConcurrentBacktests: number;
        defaultRiskLevel: string;
    };
};
