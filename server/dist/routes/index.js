"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const admin_1 = __importDefault(require("./admin"));
const health_1 = __importDefault(require("./health"));
const profitRoutes_1 = __importDefault(require("./profitRoutes"));
const settlement_routes_1 = __importDefault(require("./settlement.routes"));
const strategyRoutes_1 = __importDefault(require("./strategyRoutes"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.use('/auth', authRoutes_1.default);
router.use('/health', health_1.default);
// Protected routes
router.use('/users', authMiddleware_1.authenticate, userRoutes_1.default);
router.use('/admin', authMiddleware_1.authenticate, admin_1.default);
router.use('/profit', authMiddleware_1.authenticate, profitRoutes_1.default);
router.use('/settlement', authMiddleware_1.authenticate, settlement_routes_1.default);
router.use('/strategy', authMiddleware_1.authenticate, strategyRoutes_1.default);
exports.default = router;
//# sourceMappingURL=Index.js.map