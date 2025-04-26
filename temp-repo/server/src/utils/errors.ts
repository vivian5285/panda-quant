export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message);
  }
} 