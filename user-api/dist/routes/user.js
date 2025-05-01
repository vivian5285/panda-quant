"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.post('/verify-email', userController.verifyEmail.bind(userController));
router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));
exports.default = router;
//# sourceMappingURL=user.js.map