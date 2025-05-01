import { Request, Response, NextFunction } from 'express';
export declare const validateUserRequest: (schema: any) => (req: Request, res: Response, next: NextFunction) => void;
