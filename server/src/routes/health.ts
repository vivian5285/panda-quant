import { Router } from 'express';
import { healthController } from '../controllers/healthController';

const router = Router();

router.get('/', healthController.checkHealth);

export default router; 