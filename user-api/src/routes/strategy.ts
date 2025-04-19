import { Router } from 'express';
import { StrategyController } from '../controllers/strategy.controller';

const router = Router();
const strategyController = new StrategyController();

router.get('/', strategyController.getStrategies);
router.post('/', strategyController.createStrategy);
router.put('/:id', strategyController.updateStrategy);
router.delete('/:id', strategyController.deleteStrategy);

export default router; 