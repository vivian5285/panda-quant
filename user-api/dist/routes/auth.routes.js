"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/send-code', authController.sendVerificationCode);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate_1.authenticate, authController.getProfile);
router.put('/me', authenticate_1.authenticate, authController.updateProfile);
router.put('/change-password', authenticate_1.authenticate, authController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map