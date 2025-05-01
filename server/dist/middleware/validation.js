"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonValidators = exports.validationMiddleware = exports.validateObjectId = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const error_1 = require("./error");
const validateRequest = (req, res, next) => {
    if (!req.body) {
        next(new error_1.ValidationError('Request body is required'));
        return;
    }
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateRequest = validateRequest;
const validateObjectId = (id) => {
    return mongoose_1.Types.ObjectId.isValid(id);
};
exports.validateObjectId = validateObjectId;
const validationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validationMiddleware = validationMiddleware;
exports.commonValidators = {
    requiredString: (field) => {
        return (req, res, next) => {
            if (!req.body[field] || typeof req.body[field] !== 'string') {
                res.status(400).json({ error: `${field} is required and must be a string` });
                return;
            }
            next();
        };
    },
    optionalString: (field) => {
        return (req, res, next) => {
            if (req.body[field] && typeof req.body[field] !== 'string') {
                res.status(400).json({ error: `${field} must be a string` });
                return;
            }
            next();
        };
    }
};
//# sourceMappingURL=validation.js.map