export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string = 'Bad request') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

export class ValidationError extends Error {
  statusCode: number;
  errors: Array<{ field: string; message: string }>;

  constructor(errors: Array<{ field: string; message: string }>) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

export class DatabaseError extends Error {
  statusCode: number;

  constructor(message: string = 'Database error occurred') {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
  }
}

export class ServiceError extends Error {
  statusCode: number;

  constructor(message: string = 'Service error occurred') {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = 500;
  }
} 