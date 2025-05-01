import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
export declare const isAdmin: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
