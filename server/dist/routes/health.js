"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const HealthController_1 = require("../controllers/HealthController");
const router = express_1.default.Router();
// Health check endpoint
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await HealthController_1.healthController.checkHealth(req, res);
}));
exports.default = router;
//# sourceMappingURL=health.js.map