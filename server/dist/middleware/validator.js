import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors';
export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : err.type,
            message: err.msg
        }));
        throw new ValidationError(extractedErrors);
    };
};
export const validateQuery = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : err.type,
            message: err.msg
        }));
        throw new ValidationError(extractedErrors);
    };
};
export const validateParams = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : err.type,
            message: err.msg
        }));
        throw new ValidationError(extractedErrors);
    };
};
export const commonValidators = {
    email: (field = 'email') => {
        return {
            field,
            validators: [
                (value) => {
                    if (!value) {
                        throw new Error('Email is required');
                    }
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        throw new Error('Invalid email format');
                    }
                    return true;
                }
            ]
        };
    },
    password: (field = 'password') => {
        return {
            field,
            validators: [
                (value) => {
                    if (!value) {
                        throw new Error('Password is required');
                    }
                    if (value.length < 6) {
                        throw new Error('Password must be at least 6 characters long');
                    }
                    return true;
                }
            ]
        };
    },
    requiredString: (field) => {
        return {
            field,
            validators: [
                (value) => {
                    if (!value) {
                        throw new Error(`${field} is required`);
                    }
                    if (typeof value !== 'string') {
                        throw new Error(`${field} must be a string`);
                    }
                    return true;
                }
            ]
        };
    }
};
//# sourceMappingURL=validator.js.map