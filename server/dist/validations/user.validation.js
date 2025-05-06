export const validateUserRequest = (schema) => {
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
//# sourceMappingURL=user.validation.js.map