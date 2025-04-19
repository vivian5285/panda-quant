"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verification_controller_1 = require("../controllers/verification.controller");
const router = express_1.default.Router();
const verificationController = new verification_controller_1.VerificationController();
// 发送验证码
router.post('/send', verificationController.sendCode);
// 验证验证码
router.post('/verify', verificationController.verifyCode);
exports.default = router;
