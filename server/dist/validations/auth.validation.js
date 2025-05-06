"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthRequest = void 0;
const validateAuthRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const validationError = error;
            res.status(400).json({
                message: 'Validation error',
                details: validationError.details.map(detail => detail.message)
            });
            return;
        }
        next();
    };
};
exports.validateAuthRequest = validateAuthRequest;
//# sourceMappingURL=auth.validation.js.map