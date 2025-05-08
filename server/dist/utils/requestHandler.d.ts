import { Response, NextFunction, RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/Auth';
type RequestHandlerFunction = (req: AuthenticatedRequest, res: Response, next?: NextFunction) => Promise<void>;
export declare const handleRequest: (handler: RequestHandlerFunction) => RequestHandler;
export {};
//# sourceMappingURL=requestHandler.d.ts.map