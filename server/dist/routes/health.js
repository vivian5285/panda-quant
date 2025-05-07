"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
router.get('/', (0, errorHandler_1.handleRequest)(async (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
}));
exports.default = router;
//# sourceMappingURL=health.js.map