"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const AppError_1 = require("../utils/AppError");
const isAdmin = (req, _res, next) => {
    if (!req.user || !req.user.isAdmin) {
        throw new AppError_1.AppError('Unauthorized - Admin access required', 403);
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=admin.js.map