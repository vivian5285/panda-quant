import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { ValidationError } from './error';
export const validateRequest = (req, res, next) => {
    if (!req.body) {
        next(new ValidationError('Request body is required'));
        return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
export const validateObjectId = (id) => {
    return Types.ObjectId.isValid(id);
};
export const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
export const commonValidators = {
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