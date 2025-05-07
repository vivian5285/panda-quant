import { RequestHandler } from '../types/express';
import type { Schema } from 'joi';
export declare const validate: (schema: Schema) => RequestHandler;
export declare const validateParams: (schema: Schema) => RequestHandler;
export declare const validateQuery: (schema: Schema) => RequestHandler;
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
//# sourceMappingURL=validator.d.ts.map