import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/User';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const isAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const hasPermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
