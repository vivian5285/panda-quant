import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
export declare const validate: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateQuery: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateParams: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const commonValidators: {
    email: (field?: string) => {
        field: string;
        validators: ((value: string) => boolean)[];
    };
    password: (field?: string) => {
        field: string;
        validators: ((value: string) => boolean)[];
    };
    requiredString: (field: string) => {
        field: string;
        validators: ((value: string) => boolean)[];
    };
};
