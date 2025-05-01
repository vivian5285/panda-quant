declare class Logger {
    private prefix;
    constructor(prefix?: string);
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    debug(message: string, ...args: unknown[]): void;
}
export declare const logger: Logger;
export declare const createLogger: (prefix: string) => Logger;
export declare const requestLogger: Logger;
export declare const errorLogger: Logger;
export {};
