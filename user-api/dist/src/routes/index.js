"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const validateRequest_1 = require("../middleware/validateRequest");
const errorHandler_1 = require("../middleware/errorHandler");
const requestLogger_1 = require("../middleware/requestLogger");
const performanceMonitor_1 = require("../middleware/performanceMonitor");
const rateLimiter_1 = require("../middleware/rateLimiter");
// 导入路由
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const asset_1 = __importDefault(require("./asset"));
const strategy_1 = __importDefault(require("./strategy"));
const backtest_1 = __importDefault(require("./backtest"));
const transaction_1 = __importDefault(require("./transaction"));
const router = express_1.default.Router();
// 中间件
router.use(validateRequest_1.validateRequest);
router.use(errorHandler_1.errorHandler);
router.use(requestLogger_1.requestLogger);
router.use(performanceMonitor_1.performanceMonitor);
router.use(rateLimiter_1.rateLimiter);
// API 文档
router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// 健康检查
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// API 路由
router.use('/api/v1/auth', auth_1.default);
router.use('/api/v1/users', user_1.default);
router.use('/api/v1/assets', asset_1.default);
router.use('/api/v1/strategies', strategy_1.default);
router.use('/api/v1/backtests', backtest_1.default);
router.use('/api/v1/transactions', transaction_1.default);
// 404 处理
router.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});
exports.default = router;
