import type { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../models/User';
interface AuthenticatedRequest extends Request {
    user?: IUserDocument;
    headers: {
        authorization?: string;
    };
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map