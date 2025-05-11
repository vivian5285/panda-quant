"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const strategyRoutes_1 = __importDefault(require("./strategyRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const settlement_routes_1 = __importDefault(require("./settlement.routes"));
const commissionRoutes_1 = __importDefault(require("./commissionRoutes"));
const withdrawalRoutes_1 = __importDefault(require("./withdrawalRoutes"));
const userLevelRoutes_1 = __importDefault(require("./userLevelRoutes"));
const blacklistRoutes_1 = __importDefault(require("./blacklistRoutes"));
const admin_1 = __importDefault(require("./admin"));
const profitRoutes_1 = __importDefault(require("./profitRoutes"));
const health_1 = __importDefault(require("./health"));
const router = express_1.default.Router();
// Health check route
router.use('/health', health_1.default);
// Auth routes
router.use('/auth', authRoutes_1.default);
// User routes
router.use('/users', userRoutes_1.default);
// Strategy routes
router.use('/strategies', strategyRoutes_1.default);
// Settlement routes
router.use('/settlements', settlement_routes_1.default);
// Commission routes
router.use('/commissions', commissionRoutes_1.default);
// Withdrawal routes
router.use('/withdrawals', withdrawalRoutes_1.default);
// User level routes
router.use('/user-levels', userLevelRoutes_1.default);
// Blacklist routes
router.use('/blacklist', blacklistRoutes_1.default);
// Admin routes
router.use('/admin', admin_1.default);
// Profit routes
router.use('/profits', profitRoutes_1.default);
exports.default = router;
//# sourceMappingURL=Index.js.map