"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
const authController = new auth_controller_1.AuthController();
// 注册
router.post('/register', authController.register);
// 登录
router.post('/login', authController.login);
// 获取用户信息（需要认证）
router.get('/profile', authenticate_1.authenticate, authController.getProfile);
exports.default = router;
