export declare class StrategyError extends Error {
    readonly code: string;
    readonly context?: any | undefined;
    constructor(message: string, code: string, context?: any | undefined);
}
export declare const handleError: (error: unknown, context?: string) => never;
