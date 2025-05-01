export interface RetryOptions {
    maxAttempts: number;
    delay: number;
    backoffFactor: number;
}
export declare const withRetry: <T>(fn: () => Promise<T>, options?: Partial<RetryOptions>) => Promise<T>;
