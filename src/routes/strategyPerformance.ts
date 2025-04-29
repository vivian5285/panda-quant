import { Router, Request, Response } from 'express';
import { StrategyPerformanceController } from '../controllers/strategyPerformance';

const router = Router();

router.post('/', (req: Request, res: Response) => StrategyPerformanceController.createStrategyPerformance(req, res));
router.get('/:id', (req: Request, res: Response) => StrategyPerformanceController.getStrategyPerformanceById(req, res));
router.get('/strategy/:strategyId', (req: Request, res: Response) => StrategyPerformanceController.getStrategyPerformanceByStrategyId(req, res));
router.get('/user/:userId', (req: Request, res: Response) => StrategyPerformanceController.getStrategyPerformanceByUserId(req, res));
router.put('/:id', (req: Request, res: Response) => StrategyPerformanceController.updateStrategyPerformance(req, res));
router.delete('/:id', (req: Request, res: Response) => StrategyPerformanceController.deleteStrategyPerformance(req, res));

export default router; 