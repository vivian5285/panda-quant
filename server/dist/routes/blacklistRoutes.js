import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/Auth';
import { blacklistController } from '../controllers/blacklistController';
const router = Router();
// 所有路由都需要认证
router.use(authenticate);
// 获取所有黑名单条目
router.get('/', hasPermission('blacklist:read'), blacklistController.getAllEntries);
// 获取单个黑名单条目
router.get('/:id', hasPermission('blacklist:read'), blacklistController.getEntryById);
// 创建黑名单条目
router.post('/', hasPermission('blacklist:write'), blacklistController.createEntry);
// 更新黑名单条目
router.put('/:id', hasPermission('blacklist:write'), blacklistController.updateEntry);
// 删除黑名单条目
router.delete('/:id', hasPermission('blacklist:write'), blacklistController.deleteEntry);
// 搜索黑名单条目
router.get('/search', hasPermission('blacklist:read'), blacklistController.searchEntries);
export const setupBlacklistRoutes = (router) => {
    // 获取所有黑名单条目
    router.get('/blacklist', hasPermission('blacklist:read'), blacklistController.getAllEntries);
    // 获取单个黑名单条目
    router.get('/blacklist/:id', hasPermission('blacklist:read'), blacklistController.getEntryById);
    // 创建黑名单条目
    router.post('/blacklist', hasPermission('blacklist:write'), blacklistController.createEntry);
    // 更新黑名单条目
    router.put('/blacklist/:id', hasPermission('blacklist:write'), blacklistController.updateEntry);
    // 删除黑名单条目
    router.delete('/blacklist/:id', hasPermission('blacklist:write'), blacklistController.deleteEntry);
    // 搜索黑名单条目
    router.get('/blacklist/search', hasPermission('blacklist:read'), blacklistController.searchEntries);
};
export default router;
//# sourceMappingURL=blacklistRoutes.js.map