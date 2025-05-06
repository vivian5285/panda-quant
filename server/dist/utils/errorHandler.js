import { Error as MongooseError } from 'mongoose';
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } from './errors';
import { logger } from './logger';
export function handleError(res, error) {
    logger.error(error);
    if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
    }
    else if (error instanceof BadRequestError) {
        res.status(400).json({ error: error.message });
    }
    else if (error instanceof UnauthorizedError) {
        res.status(401).json({ error: error.message });
    }
    else if (error instanceof ForbiddenError) {
        res.status(403).json({ error: error.message });
    }
    else if (error instanceof MongooseError.ValidationError) {
        const errors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
        }));
        res.status(400).json({
            success: false,
            errors: errors
        });
    }
    else if (error instanceof MongooseError.CastError) {
        res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    else {
        res.status(500).json({ error: '服务器内部错误' });
    }
}
export const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err);
    // Mongoose validation error
    if (err instanceof MongooseError.ValidationError) {
        return res.status(400).json({
            success: false,
            error: {
                name: 'ValidationError',
                message: 'Validation Error',
                details: Object.values(err.errors).map(error => ({
                    field: error.path,
                    message: error.message
                }))
            }
        });
    }
    // Express validator error
    if (err.errors && Array.isArray(err.errors)) {
        return res.status(400).json({
            success: false,
            error: {
                name: 'ValidationError',
                message: 'Validation Error',
                details: err.errors
            }
        });
    }
    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: {
                name: 'AuthenticationError',
                message: 'Invalid token'
            }
        });
    }
    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        error: {
            name: err.name || 'Error',
            message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
};
//# sourceMappingURL=errorHandler.js.map