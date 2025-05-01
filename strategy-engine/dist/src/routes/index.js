"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const strategy_1 = require("../controllers/strategy");
const health_1 = require("../controllers/health");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// 健康检查
router.get('/health', health_1.healthCheck);
// 策略执行
router.post('/strategies/execute', auth_1.authenticateToken, validation_1.validateStrategyExecution, strategy_1.executeStrategy);
// 策略状态更新
router.post('/strategies/status', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 处理策略状态更新
    res.json({ success: true });
}));
exports.default = router;
