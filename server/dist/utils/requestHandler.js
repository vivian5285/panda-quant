"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
const handleRequest = (handler) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }
            const result = await handler(req, res, next);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.handleRequest = handleRequest;
//# sourceMappingURL=requestHandler.js.map