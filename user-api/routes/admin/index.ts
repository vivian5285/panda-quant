import express from 'express';
import chainRoutes from './chain';

const router = express.Router();

// 注册链管理路由
router.use('/chains', chainRoutes);

export default router; 