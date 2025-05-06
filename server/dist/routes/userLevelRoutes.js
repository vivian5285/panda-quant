"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userLevelController_1 = require("../controllers/userLevelController");
const Auth_1 = require("../middleware/Auth");
const router = (0, express_1.Router)();
const userLevelController = new userLevelController_1.UserLevelController();
// Admin routes
router.get('/admin/user-levels', Auth_1.authenticate, Auth_1.isAdmin, async (req, res, next) => {
    try {
        await userLevelController.getAllLevels(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/user-levels', Auth_1.authenticate, Auth_1.isAdmin, async (req, res, next) => {
    try {
        await userLevelController.createLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/admin/user-levels/:id', Auth_1.authenticate, Auth_1.isAdmin, async (req, res, next) => {
    try {
        await userLevelController.updateLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/admin/user-levels/:id', Auth_1.authenticate, Auth_1.isAdmin, async (req, res, next) => {
    try {
        await userLevelController.deleteLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
// User routes
router.get('/user-levels', Auth_1.authenticate, async (req, res, next) => {
    try {
        await userLevelController.getUserLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/user-levels/:id', Auth_1.authenticate, async (req, res, next) => {
    try {
        await userLevelController.getUserLevel(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=userLevelRoutes.js.map