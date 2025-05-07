import type { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../models/User';
interface AuthenticatedRequest extends Request {
    user?: IUserDocument;
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
export declare const isAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const hasPermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=auth.d.ts.map