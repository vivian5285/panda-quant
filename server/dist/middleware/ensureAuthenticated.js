export const ensureAuthenticated = (req, res, next) => {
    const authenticatedReq = req;
    if (!authenticatedReq.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    next();
};
//# sourceMappingURL=ensureAuthenticated.js.map