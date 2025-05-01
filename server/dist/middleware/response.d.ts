import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Response {
            success: (data: any, message?: string) => void;
            error: (message: string, statusCode?: number) => void;
        }
    }
}
export declare const responseHandler: (_req: Request, res: Response, next: NextFunction) => void;
