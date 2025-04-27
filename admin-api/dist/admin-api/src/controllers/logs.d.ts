import { Request, Response } from 'express';
export declare const getLogs: (req: Request, res: Response) => Promise<void>;
export declare const getLogStats: (req: Request, res: Response) => Promise<void>;
export declare class LogController {
    createLog(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
