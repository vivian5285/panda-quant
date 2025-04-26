import { Router } from 'express';
import { getLogs, getLogStats } from '../controllers/logs';
import { auth } from '../middleware/auth';

const router = Router();

// 获取日志列表
router.get('/', auth, getLogs);

// 获取日志统计
router.get('/stats', auth, getLogStats);

export default router; 