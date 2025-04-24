import { Response } from 'express';
import { ValidationError } from 'mongoose';
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } from './errors';

export function handleError(res: Response, error: any): void {
  console.error(error);

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
  } else if (error instanceof BadRequestError) {
    res.status(400).json({ error: error.message });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ForbiddenError) {
    res.status(403).json({ error: error.message });
  } else if (error instanceof ValidationError) {
    const errors = Object.values(error.errors).map(err => err.message);
    res.status(400).json({ error: errors.join(', ') });
  } else {
    res.status(500).json({ error: '服务器内部错误' });
  }
} 