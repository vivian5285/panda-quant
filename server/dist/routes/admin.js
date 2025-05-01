"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const strategy_1 = __importDefault(require("../controllers/strategy"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
// 所有路由都需要认证和管理员权限
router.use(auth_1.authenticate);
router.use(auth_1.isAdmin);
// 用户管理路由
router.get('/users', async (req, res) => {
    await userController.getAllUsers(req, res);
});
router.post('/users', async (req, res, next) => {
    try {
        await userController.register(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/users/:id', async (req, res, next) => {
    try {
        await userController.updateUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/users/:id', async (req, res) => {
    await userController.deleteUser(req, res);
});
// 策略管理路由
router.get('/strategies', async (req, res) => {
    await strategy_1.default.getStrategies(req, res);
});
router.get('/strategies/:id', async (req, res) => {
    await strategy_1.default.getStrategy(req, res);
});
router.post('/strategies', async (req, res) => {
    await strategy_1.default.createStrategy(req, res);
});
router.put('/strategies/:id', async (req, res) => {
    await strategy_1.default.updateStrategy(req, res);
});
router.delete('/strategies/:id', async (req, res) => {
    await strategy_1.default.deleteStrategy(req, res);
});
exports.default = router;
//# sourceMappingURL=admin.js.map