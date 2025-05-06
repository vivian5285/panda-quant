"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const validateRequest_1 = require("../middleware/validateRequest");
const error_middleware_1 = require("../middleware/error.middleware");
const requestLogger_1 = require("../middleware/requestLogger");
const performanceMonitor_1 = require("../middleware/performanceMonitor");
const rateLimiter_1 = require("../middleware/rateLimiter");
const user_1 = __importDefault(require("./user"));
const asset_1 = __importDefault(require("./asset"));
const strategy_1 = __importDefault(require("./strategy"));
const backtest_1 = __importDefault(require("./backtest"));
const transaction_1 = __importDefault(require("./transaction"));
const router = express_1.default.Router();
router.use(validateRequest_1.validateRequest);
router.use(requestLogger_1.requestLogger);
router.use(performanceMonitor_1.performanceMonitor);
router.use(rateLimiter_1.rateLimiter);
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Panda Quant API',
        description: '量化交易系统API文档',
        version: '1.0.0'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: '开发环境'
        }
    ],
    paths: {
        '/api/v1/users/register': {
            post: {
                tags: ['用户'],
                summary: '用户注册',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        description: '用户邮箱'
                                    },
                                    password: {
                                        type: 'string',
                                        description: '用户密码'
                                    },
                                    name: {
                                        type: 'string',
                                        description: '用户姓名'
                                    },
                                    code: {
                                        type: 'string',
                                        description: '验证码'
                                    }
                                },
                                required: ['email', 'password', 'name', 'code']
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: '注册成功',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string'
                                        },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                id: {
                                                    type: 'string'
                                                },
                                                email: {
                                                    type: 'string'
                                                },
                                                name: {
                                                    type: 'string'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: '请求参数错误'
                    },
                    '409': {
                        description: '邮箱已被注册'
                    }
                }
            }
        }
    }
};
router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
router.use('/api/v1/users', user_1.default);
router.use('/api/v1/assets', asset_1.default);
router.use('/api/v1/strategies', strategy_1.default);
router.use('/api/v1/backtests', backtest_1.default);
router.use('/api/v1/transactions', transaction_1.default);
router.use((_req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});
router.use(error_middleware_1.errorHandler);
exports.default = router;
//# sourceMappingURL=index.js.map