"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
// 注册
router.post('/register', authController_1.default.register);
// 登录
router.post('/login', authController_1.default.login);
// 获取当前用户信息
router.get('/me', auth_middleware_1.authenticateToken, authController_1.default.getCurrentUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map