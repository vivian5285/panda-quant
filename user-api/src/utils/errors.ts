export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'ServiceError';
  }
} 