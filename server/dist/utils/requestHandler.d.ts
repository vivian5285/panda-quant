import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare const handleRequest: (handler: (req: AuthenticatedRequest, res: Response) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
