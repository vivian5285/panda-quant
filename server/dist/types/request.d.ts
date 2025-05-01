import { Request } from 'express';
import { IUser } from './user';
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export type AuthRequest = AuthenticatedRequest;
