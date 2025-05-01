import { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (validations: any[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
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
