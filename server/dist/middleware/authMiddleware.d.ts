import type { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../models/user.model';
export interface AuthRequest extends Request {
    user?: IUserDocument;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authMiddleware.d.ts.map