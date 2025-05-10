import { Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../types/express';
export type RequestHandlerFunction<T = any> = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<T>;
export declare const handleRequest: <T = any>(handler: RequestHandlerFunction<T>) => RequestHandler;
//# sourceMappingURL=requestHandler.d.ts.map