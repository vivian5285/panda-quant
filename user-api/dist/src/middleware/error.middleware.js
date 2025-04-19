"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof errors_1.ValidationError) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
    else if (err instanceof errors_1.AuthenticationError) {
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
    else if (err instanceof errors_1.AuthorizationError) {
        res.status(403).json({
            success: false,
            message: err.message
        });
    }
    else if (err instanceof errors_1.ServiceError || err instanceof errors_1.DatabaseError) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.errorHandler = errorHandler;
