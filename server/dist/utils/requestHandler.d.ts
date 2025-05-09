import { Response, NextFunction, RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/express';
type RequestHandlerFunction = (req: AuthenticatedRequest, res: Response, next?: NextFunction) => Promise<void>;
export declare const handleRequest: (handler: RequestHandlerFunction) => RequestHandler;
export {};
//# sourceMappingURL=requestHandler.d.ts.map