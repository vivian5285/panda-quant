import { Router } from 'express';
import { getMarketData } from '../controllers/marketController';

const router = Router();

router.get('/data', getMarketData);

export default router; 