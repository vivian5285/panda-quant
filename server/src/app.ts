import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { rateLimiter } from './middleware/rateLimiter';
import { cacheMiddleware } from './middleware/cache';
import router from './routes';
import { logger } from './utils/logger';
import { AppError } from './utils/AppError';

const app = express();

// Swagger 配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Panda Quant API',
      version: '1.0.0',
      description: 'Panda Quant Trading Platform API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // 指定 API 路由文件
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cacheMiddleware as express.RequestHandler);

// API 文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 健康检查
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok' });
});

// API 路由（应用速率限制）
app.use('/api', rateLimiter);

// Routes
app.use(router);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error:', err);
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start server
const port = config.server.port;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export default app; 