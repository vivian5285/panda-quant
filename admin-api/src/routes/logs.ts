import { Router } from 'express';
import { LogController } from '../controllers/logs';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const logController = new LogController();

// 获取日志列表
router.get('/', authMiddleware, logController.getLogs.bind(logController));

// 创建新日志
router.post('/', authMiddleware, logController.createLog.bind(logController));

export default router; 