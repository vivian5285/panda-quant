"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonValidators = exports.validateParams = exports.validateQuery = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const errors_1 = require("../utils/errors");
const validate = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : err.type,
            message: err.msg
        }));
        throw new errors_1.ValidationError(extractedErrors);
    });
};
exports.validate = validate;
const validateQuery = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : err.type,
            message: err.msg
        }));
        throw new errors_1.ValidationError(extractedErrors);
    });
};
exports.validateQuery = validateQuery;
const validateParams = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : err.type,
            message: err.msg
        }));
        throw new errors_1.ValidationError(extractedErrors);
    });
};
exports.validateParams = validateParams;
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