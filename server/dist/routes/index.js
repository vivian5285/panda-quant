"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const withdrawalRoutes_1 = __importDefault(require("./withdrawalRoutes"));
const commissionRoutes_1 = __importDefault(require("./commissionRoutes"));
const userLevelRoutes_1 = __importDefault(require("./userLevelRoutes"));
const blacklistRoutes_1 = __importDefault(require("./blacklistRoutes"));
const admin_1 = __importDefault(require("./admin"));
const Strategy_1 = __importDefault(require("./Strategy"));
const Settlement_1 = __importDefault(require("./Settlement"));
const Auth_1 = require("../middleware/Auth");
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const requestHandler_1 = require("../utils/requestHandler");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
const authController = new authController_1.AuthController();
// Public routes (no authentication required)
router.post('/login', (0, requestHandler_1.handleRequest)((req, res) => authController.login(req, res)));
router.post('/register', (0, requestHandler_1.handleRequest)((req, res) => authController.register(req, res)));
// Protected routes (require authentication)
router.use(Auth_1.authenticate);
// 设置路由
router.use('/auth', authRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/withdrawals', withdrawalRoutes_1.default);
router.use('/commissions', commissionRoutes_1.default);
router.use('/user-levels', userLevelRoutes_1.default);
router.use('/blacklist', blacklistRoutes_1.default);
router.use('/admin', admin_1.default);
router.use('/strategies', Strategy_1.default);
router.use('/settlement', Settlement_1.default);
// 用户路由
router.get('/profile', (0, requestHandler_1.handleRequest)((req, res) => userController.getProfile(req, res)));
router.put('/profile', (0, requestHandler_1.handleRequest)((req, res) => userController.updateProfile(req, res)));
router.get('/me', (0, requestHandler_1.handleRequest)((req, res) => authController.getCurrentUser(req, res)));
exports.default = router;
//# sourceMappingURL=Index.js.map