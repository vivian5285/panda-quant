import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: any;
      headers: any;
      body: any;
    }
    interface Response extends ExpressResponse {}
    interface NextFunction extends ExpressNextFunction {}
  }
}

export interface AuthRequest extends Express.Request {
  user?: any;
  headers: any;
  body: any;
}

export interface AuthResponse extends Express.Response {}

export interface AuthNextFunction extends Express.NextFunction {} 