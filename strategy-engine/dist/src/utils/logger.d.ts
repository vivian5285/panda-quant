import winston from 'winston';
export declare const logger: winston.Logger;
export declare const logError: (error: Error, context?: string) => void;
export declare const logInfo: (message: string, meta?: any) => void;
