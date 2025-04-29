import { Router } from 'express';
import { UserLevelController } from '../controllers/userLevelController';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const router = Router();
const userLevelController = new UserLevelController();

router.post('/', authMiddleware, requireAdmin, (req, res) => userLevelController.createUserLevel(req, res));
router.get('/:id', authMiddleware, (req, res) => userLevelController.getUserLevelById(req, res));
router.get('/', authMiddleware, (req, res) => userLevelController.getUserLevels(req, res));
router.put('/:id', authMiddleware, requireAdmin, (req, res) => userLevelController.updateUserLevel(req, res));
router.delete('/:id', authMiddleware, requireAdmin, (req, res) => userLevelController.deleteUserLevel(req, res));

export default router; 