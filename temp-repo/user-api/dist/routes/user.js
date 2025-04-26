"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// 注册路由
router.post('/register', (req, res) => user_controller_1.UserController.register(req, res));
// 登录路由
router.post('/login', (req, res) => user_controller_1.UserController.login(req, res));
// 验证邮箱路由
router.post('/verify-email', (req, res) => user_controller_1.UserController.verifyEmail(req, res));
router.get('/profile', (req, res) => user_controller_1.UserController.getProfile(req, res));
router.put('/profile', (req, res) => user_controller_1.UserController.updateProfile(req, res));
exports.default = router;
