import { Request, Response, NextFunction } from 'express';
import { handleContractError } from '../utils/errorDecoder';

export function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', error);

    // 处理智能合约错误
    if (error.code === -32000 && error.data) {
        const decodedError = handleContractError(error);
        return res.status(400).json({
            success: false,
            error: {
                code: error.code,
                message: decodedError
            }
        });
    }

    // 处理其他类型的错误
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            code: error.code || statusCode,
            message
        }
    });
} 