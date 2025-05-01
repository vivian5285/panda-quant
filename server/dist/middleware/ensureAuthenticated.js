"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = void 0;
const ensureAuthenticated = (req, res, next) => {
    const authenticatedReq = req;
    if (!authenticatedReq.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    next();
};
exports.ensureAuthenticated = ensureAuthenticated;
//# sourceMappingURL=ensureAuthenticated.js.map