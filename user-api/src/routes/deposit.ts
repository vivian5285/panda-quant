import { Router, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { AuthRequest } from '../types/express.d';
import {
  createDeposit,
  getDeposits,
  getDeposit,
  updateDeposit,
  deleteDeposit
} from '../controllers/deposit.controller';

const router = Router();

// 所有路由都需要认证
router.use(authenticate);

// 创建存款
router.post('/', async (req: AuthRequest, res: Response) => {
  await createDeposit(req, res);
});

// 获取用户的所有存款
router.get('/', async (req: AuthRequest, res: Response) => {
  await getDeposits(req, res);
});

// 获取特定存款
router.get('/:id', async (req: AuthRequest, res: Response) => {
  await getDeposit(req, res);
});

// 更新存款状态
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  await updateDeposit(req, res);
});

// 删除存款
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await deleteDeposit(req, res);
});

export default router; 