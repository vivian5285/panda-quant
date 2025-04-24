import express from 'express';
import cors from 'cors';
import routes from './routes';
import { responseHandler } from './middleware/response';
import { errorHandler } from './middleware/error';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(responseHandler);

// 路由
app.use(routes);

// 错误处理
app.use(errorHandler);

export default app; 