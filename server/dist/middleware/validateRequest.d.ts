import { Request, NextFunction } from 'express';
export declare const validateRequest: (schema: any) => (req: Request, _res: any, next: NextFunction) => Promise<void>;
