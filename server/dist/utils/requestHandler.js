"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
const handleRequest = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.handleRequest = handleRequest;
//# sourceMappingURL=requestHandler.js.map