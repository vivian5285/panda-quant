import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: any;
      headers: any;
      body: any;
      params: any;
    }
    interface Response extends ExpressResponse {
      status: (code: number) => Response;
      json: (body: any) => Response;
    }
    interface NextFunction extends ExpressNextFunction {}
  }
}

export interface AuthRequest extends Express.Request {
  user?: any;
}

export interface AuthResponse extends Express.Response {}

export interface AuthNextFunction extends Express.NextFunction {}

export type AuthRouter = Express.Router; 