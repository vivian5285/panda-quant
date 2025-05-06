import { logger } from '../utils/logger';
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
export const errorHandler = (err, _req, res, _next) => {
    logger.error('Error:', err);
    if (err instanceof ValidationError) {
        res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
        return;
    }
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};
//# sourceMappingURL=error.js.map