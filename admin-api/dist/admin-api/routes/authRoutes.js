"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 公开路由
router.post('/login', authController_1.login);
router.post('/request-password-reset', authController_1.requestPasswordReset);
router.post('/reset-password', authController_1.resetPassword);
// 需要认证的路由
router.post('/logout', auth_1.authenticateToken, authController_1.logout);
router.put('/profile', auth_1.authenticateToken, authController_1.updateUserProfile);
exports.default = router;
