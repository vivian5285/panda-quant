import { logError } from './logger';

export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoffFactor: number;
}

const defaultOptions: RetryOptions = {
  maxAttempts: 3,
  delay: 1000,
  backoffFactor: 2,
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> => {
  const { maxAttempts, delay, backoffFactor } = { ...defaultOptions, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      logError(lastError, `Attempt ${attempt} failed`);

      if (attempt === maxAttempts) {
        throw lastError;
      }

      const waitTime = delay * Math.pow(backoffFactor, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}; 