import { Router } from 'express';
import { UserLevelController } from '../controllers/userLevelController';
import { authenticate, isAdmin } from '../middleware/Auth';
const router = Router();
const userLevelController = new UserLevelController();
// Admin routes
router.get('/admin/user-levels', authenticate, isAdmin, async (req, res, next) => {
    try {
        await userLevelController.getAllLevels(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/user-levels', authenticate, isAdmin, async (req, res, next) => {
    try {
        await userLevelController.createLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/admin/user-levels/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        await userLevelController.updateLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/admin/user-levels/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        await userLevelController.deleteLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
// User routes
router.get('/user-levels', authenticate, async (req, res, next) => {
    try {
        await userLevelController.getUserLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/user-levels/:id', authenticate, async (req, res, next) => {
    try {
        await userLevelController.getUserLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=userLevelRoutes.js.map