export declare const config: {
    server: {
        port: string | number;
        env: string;
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
    redis: {
        host: string;
        port: number;
        password: string;
        db: number;
        url: string;
    };
    api: {
        userBaseUrl: string;
        adminBaseUrl: string;
        strategyEngineUrl: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    monitoring: {
        interval: number;
        timeout: number;
    };
    logging: {
        level: string;
        filename: string;
    };
};
