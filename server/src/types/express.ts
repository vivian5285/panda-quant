import { Request } from 'express';
import { IUserDocument } from '../models/user.model';

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