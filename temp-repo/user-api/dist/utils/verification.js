"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = generateVerificationCode;
function generateVerificationCode() {
    // 生成6位数字验证码
    return Math.floor(100000 + Math.random() * 900000).toString();
}
