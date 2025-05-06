import { AppError } from '../utils/AppError';
export const isAdmin = (req, _res, next) => {
    if (!req.user || !req.user.isAdmin) {
        throw new AppError('Unauthorized - Admin access required', 403);
    }
    next();
};
//# sourceMappingURL=admin.js.map