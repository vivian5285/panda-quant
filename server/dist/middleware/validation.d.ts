import { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateObjectId: (id: string) => boolean;
export declare const validationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const commonValidators: {
    requiredString: (field: string) => (req: Request, res: Response, next: NextFunction) => void;
    optionalString: (field: string) => (req: Request, res: Response, next: NextFunction) => void;
};
