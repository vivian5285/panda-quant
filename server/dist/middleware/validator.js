"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonValidators = exports.validateQuery = exports.validateParams = exports.validate = void 0;
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        }
        catch (error) {
            logger_1.logger.error('Validation error:', error);
            next(new AppError_1.ValidationError(error.message));
        }
    };
};
exports.validate = validate;
const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.params, { abortEarly: false });
            next();
        }
        catch (error) {
            logger_1.logger.error('Params validation error:', error);
            next(new AppError_1.ValidationError(error.message));
        }
    };
};
exports.validateParams = validateParams;
const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.query, { abortEarly: false });
            next();
        }
        catch (error) {
            logger_1.logger.error('Query validation error:', error);
            next(new AppError_1.ValidationError(error.message));
        }
    };
};
exports.validateQuery = validateQuery;
exports.commonValidators = {
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