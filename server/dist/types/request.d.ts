import { Request } from 'express';
import { IUser } from './User';
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export type AuthRequest = AuthenticatedRequest;
