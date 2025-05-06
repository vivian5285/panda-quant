import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { validateRequest } from '../middleware/validateRequest';
import { errorHandler } from '../middleware/error.middleware';
import { requestLogger } from '../middleware/requestLogger';
import { performanceMonitor } from '../middleware/performanceMonitor';
import { rateLimiter } from '../middleware/rateLimiter';

// 导入路由
import userRoutes from './user';
import assetRoutes from './asset';
import strategyRoutes from './strategy';
import backtestRoutes from './backtest';
import transactionRoutes from './transaction';

const router = express.Router();

// 中间件
router.use(validateRequest);
router.use(requestLogger);
router.use(performanceMonitor);
router.use(rateLimiter);

// API 文档
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

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 健康检查
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API 路由
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/assets', assetRoutes);
router.use('/api/v1/strategies', strategyRoutes);
router.use('/api/v1/backtests', backtestRoutes);
router.use('/api/v1/transactions', transactionRoutes);

// 404 处理
router.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// 错误处理中间件
router.use(errorHandler);

export default router; 