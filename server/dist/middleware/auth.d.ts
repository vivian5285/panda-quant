import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/user';
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const hasPermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
