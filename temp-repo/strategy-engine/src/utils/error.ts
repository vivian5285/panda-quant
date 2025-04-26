import { logError } from './logger';

export class StrategyError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: any
  ) {
    super(message);
    this.name = 'StrategyError';
  }
}

export const handleError = (error: unknown, context?: string): never => {
  if (error instanceof StrategyError) {
    logError(error, context);
    throw error;
  }

  if (error instanceof Error) {
    logError(error, context);
    throw new StrategyError(
      error.message,
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }

  const unknownError = new Error('An unknown error occurred');
  logError(unknownError, context);
  throw new StrategyError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    { originalError: error }
  );
}; 