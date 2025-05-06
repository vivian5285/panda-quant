"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
router.get('/', healthController_1.healthController.checkHealth);
exports.default = router;
//# sourceMappingURL=health.js.map