"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
const typeGuards_1 = require("./typeGuards");
const handleRequest = (handler) => {
    return async (req, res, next) => {
        try {
            if (!(0, typeGuards_1.isAuthenticatedRequest)(req)) {
                throw new Error('Invalid request type');
            }
            const authReq = req;
            await handler(authReq, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.handleRequest = handleRequest;
//# sourceMappingURL=requestHandler.js.map