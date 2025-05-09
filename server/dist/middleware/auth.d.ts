import type { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../models/user.model';
export interface AuthenticatedRequest extends Request {
    user?: IUserDocument;
    headers: {
        authorization?: string;
        [key: string]: string | string[] | undefined;
    };
}
declare global {
    namespace Express {
        interface Request {
            user?: IUserDocument;
        }
    }
}
export declare const ensureAuthenticated: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (role: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const hasPermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map