"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonValidators = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    };
};
exports.validateRequest = validateRequest;
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