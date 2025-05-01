"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logs_1 = require("../controllers/logs");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.auth, logs_1.getLogs);
router.get('/stats', auth_1.auth, logs_1.getLogStats);
exports.default = router;
//# sourceMappingURL=logs.js.map