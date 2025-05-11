import { Request } from 'express';
import { IUserDocument } from './User';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: IUserDocument;
}

export {}; 