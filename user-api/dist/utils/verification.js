"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = generateVerificationCode;
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
//# sourceMappingURL=verification.js.map