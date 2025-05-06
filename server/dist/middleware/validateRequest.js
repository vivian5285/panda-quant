"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const AppError_1 = require("../utils/AppError");
const validateRequest = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                next(error);
            }
            else {
                next(new AppError_1.AppError('Invalid request data', 400));
            }
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map