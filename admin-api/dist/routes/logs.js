"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logs_1 = require("../controllers/logs");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 获取日志列表
router.get('/', auth_1.auth, logs_1.getLogs);
// 获取日志统计
router.get('/stats', auth_1.auth, logs_1.getLogStats);
exports.default = router;
