import type { Request as ExpressRequest, Response, NextFunction, RequestHandler, Router, Application } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import type { IUserDocument } from '../models/User';
import type { AuthenticatedRequest } from './Auth';

export type Request = ExpressRequest;

export type MiddlewareHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      params: ParamsDictionary;
      body: any;
      query: ParsedQs;
      headers: any;
      method: string;
      url: string;
      originalUrl: string;
      ip: string;
    }
  }
}

export type { Response, NextFunction, RequestHandler, Router, Application, AuthenticatedRequest };

interface Express {
  (): Application;
  json: () => RequestHandler;
  urlencoded: (options: { extended: boolean }) => RequestHandler;
  Router: () => Router;
}

const express: Express;
export default express; 