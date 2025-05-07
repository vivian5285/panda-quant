import type { Request as ExpressRequest, Response, NextFunction, RequestHandler, Router, Application } from 'express-serve-static-core';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import type { IUserDocument } from '../models/User';

export type Request = ExpressRequest;

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
  body: any;
  params: ParamsDictionary;
  query: ParsedQs;
  headers: {
    authorization?: string;
  };
}

export type MiddlewareHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export type { Response, NextFunction, RequestHandler, Router, Application };

interface Express {
  (): Application;
  json: () => RequestHandler;
  urlencoded: (options: { extended: boolean }) => RequestHandler;
  Router: () => Router;
}

const express: Express;
export default express; 