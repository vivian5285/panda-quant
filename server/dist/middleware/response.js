"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const responseHandler = (_req, res, next) => {
    res.success = (data, message = 'Success') => {
        res.json({
            success: true,
            message,
            data
        });
    };
    res.error = (message, statusCode = 400) => {
        res.status(statusCode).json({
            success: false,
            message
        });
    };
    next();
};
exports.responseHandler = responseHandler;
//# sourceMappingURL=response.js.map