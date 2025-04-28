import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction, Router as ExpressRouter } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: {
        id: string;
        email: string;
        role: 'user' | 'admin';
      };
      body?: any;
      params?: any;
      query?: any;
      headers?: any;
      method?: string;
      url?: string;
    }
    interface Response extends ExpressResponse {
      json: (body: any) => Response;
    }
    interface NextFunction extends ExpressNextFunction {}
    interface Router extends ExpressRouter {}
  }
}

export interface AuthRequest extends ExpressRequest {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface AuthResponse extends ExpressResponse {}

export interface AuthNextFunction extends ExpressNextFunction {}

export interface AuthRouter extends ExpressRouter {}

export { ExpressRequest, ExpressResponse, ExpressNextFunction, ExpressRouter }; 