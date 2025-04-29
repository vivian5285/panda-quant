import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { AuthUser } from './auth.types';

export interface AuthRequest extends ExpressRequest {
  user?: AuthUser;
}

export interface AuthResponse extends ExpressResponse {
  status(code: number): this;
  json(body: any): this;
}

export interface AuthNextFunction extends ExpressNextFunction {}

export type AuthRouter = Express.Router; 