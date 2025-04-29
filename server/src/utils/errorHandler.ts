import { Response, ErrorRequestHandler } from 'express';
import { Error } from 'mongoose';
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
  } else if (error instanceof Error.ValidationError) {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    res.status(400).json({
      success: false,
      errors: errors
    });
  } else if (error instanceof Error.CastError) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  } else {
    res.status(500).json({ error: '服务器内部错误' });
  }
}

export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof Error.ValidationError) {
    return res.status(400).json({
      success: false,
      errors: Object.values(err.errors).map(error => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  if (err instanceof Error.CastError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}; 