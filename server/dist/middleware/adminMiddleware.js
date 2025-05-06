export const adminMiddleware = (req, res, next) => {
    const authReq = req;
    if (!authReq.user || !authReq.user.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    next();
};
//# sourceMappingURL=adminMiddleware.js.map