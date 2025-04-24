import { Router } from 'express';
import { blacklistController } from '../controllers/blacklistController';
import { auth, requireModerator } from '../middleware/auth';

const router = Router();

// 所有路由都需要认证
router.use(auth);

// 获取所有黑名单条目 - 需要管理员或版主权限
router.get('/', requireModerator, blacklistController.getAllEntries);

// 获取单个黑名单条目 - 需要管理员或版主权限
router.get('/:id', requireModerator, blacklistController.getEntryById);

// 创建黑名单条目 - 需要管理员或版主权限
router.post('/', requireModerator, blacklistController.createEntry);

// 更新黑名单条目 - 需要管理员或版主权限
router.put('/:id', requireModerator, blacklistController.updateEntry);

// 删除黑名单条目 - 需要管理员或版主权限
router.delete('/:id', requireModerator, blacklistController.deleteEntry);

// 搜索黑名单条目 - 需要管理员或版主权限
router.get('/search', requireModerator, blacklistController.searchEntries);

export default router; 