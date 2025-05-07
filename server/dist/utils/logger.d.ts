import winston from 'winston';
declare const logger: winston.Logger;
export { logger };
export declare const stream: {
    write: (message: string) => void;
};
export declare const createLogger: (module: string) => winston.Logger;
//# sourceMappingURL=logger.d.ts.map