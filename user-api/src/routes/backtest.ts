import { Router } from 'express';
import { BacktestController } from '../controllers/backtest.controller';

const router = Router();
const backtestController = new BacktestController();

// 创建回测
router.post('/', backtestController.createBacktest.bind(backtestController));

// 获取回测列表
router.get('/', backtestController.getBacktests.bind(backtestController));

// 获取单个回测详情
router.get('/:id', backtestController.getBacktestById.bind(backtestController));

// 更新回测
router.put('/:id', backtestController.updateBacktest.bind(backtestController));

// 删除回测
router.delete('/:id', backtestController.deleteBacktest.bind(backtestController));

// 运行回测
router.post('/:id/run', backtestController.runBacktest.bind(backtestController));

// 停止回测
router.post('/:id/stop', backtestController.stopBacktest.bind(backtestController));

export default router; 