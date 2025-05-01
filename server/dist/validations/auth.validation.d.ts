import { Request, Response, NextFunction } from 'express';
export declare const validateAuthRequest: (schema: any) => (req: Request, res: Response, next: NextFunction) => void;
