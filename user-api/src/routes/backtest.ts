import { Router } from 'express';
import { BacktestController } from '../controllers/backtest.controller';

const router = Router();
const backtestController = new BacktestController();

router.get('/', backtestController.getBacktests);
router.post('/', backtestController.createBacktest);
router.get('/:id', backtestController.getBacktest);
router.delete('/:id', backtestController.deleteBacktest);

export default router; 