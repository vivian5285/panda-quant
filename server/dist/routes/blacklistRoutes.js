"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBlacklistRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const blacklistController_1 = require("../controllers/blacklistController");
const router = (0, express_1.Router)();
// 所有路由都需要认证
router.use(auth_1.authenticate);
// 获取所有黑名单条目
router.get('/', (0, auth_1.hasPermission)('blacklist:read'), blacklistController_1.blacklistController.getAllEntries);
// 获取单个黑名单条目
router.get('/:id', (0, auth_1.hasPermission)('blacklist:read'), blacklistController_1.blacklistController.getEntryById);
// 创建黑名单条目
router.post('/', (0, auth_1.hasPermission)('blacklist:write'), blacklistController_1.blacklistController.createEntry);
// 更新黑名单条目
router.put('/:id', (0, auth_1.hasPermission)('blacklist:write'), blacklistController_1.blacklistController.updateEntry);
// 删除黑名单条目
router.delete('/:id', (0, auth_1.hasPermission)('blacklist:write'), blacklistController_1.blacklistController.deleteEntry);
// 搜索黑名单条目
router.get('/search', (0, auth_1.hasPermission)('blacklist:read'), blacklistController_1.blacklistController.searchEntries);
const setupBlacklistRoutes = (router) => {
    // 获取所有黑名单条目
    router.get('/blacklist', (0, auth_1.hasPermission)('blacklist:read'), blacklistController_1.blacklistController.getAllEntries);
    // 获取单个黑名单条目
    router.get('/blacklist/:id', (0, auth_1.hasPermission)('blacklist:read'), blacklistController_1.blacklistController.getEntryById);
    // 创建黑名单条目
    router.post('/blacklist', (0, auth_1.hasPermission)('blacklist:write'), blacklistController_1.blacklistController.createEntry);
    // 更新黑名单条目
    router.put('/blacklist/:id', (0, auth_1.hasPermission)('blacklist:write'), blacklistController_1.blacklistController.updateEntry);
    // 删除黑名单条目
    router.delete('/blacklist/:id', (0, auth_1.hasPermission)('blacklist:write'), blacklistController_1.blacklistController.deleteEntry);
    // 搜索黑名单条目
    router.get('/blacklist/search', (0, auth_1.hasPermission)('blacklist:read'), blacklistController_1.blacklistController.searchEntries);
};
exports.setupBlacklistRoutes = setupBlacklistRoutes;
exports.default = router;
//# sourceMappingURL=blacklistRoutes.js.map