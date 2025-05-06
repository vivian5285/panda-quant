"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    const authReq = req;
    if (!authReq.user || !authReq.user.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map