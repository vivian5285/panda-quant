import { AppError } from '../utils/AppError';
export const validateRequest = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof AppError) {
                next(error);
            }
            else {
                next(new AppError('Invalid request data', 400));
            }
        }
    };
};
//# sourceMappingURL=validateRequest.js.map