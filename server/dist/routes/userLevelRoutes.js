"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userLevelController_1 = require("../controllers/userLevelController");
const Auth_1 = require("../middleware/Auth");
const router = (0, express_1.Router)();
const userLevelController = new userLevelController_1.UserLevelController();
// Admin routes
router.get('/admin/user-levels', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userLevelController.getAllLevels(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/admin/user-levels', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userLevelController.createLevel(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/admin/user-levels/:id', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userLevelController.updateLevel(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/admin/user-levels/:id', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userLevelController.deleteLevel(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// User routes
router.get('/user-levels', Auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userLevelController.getUserLevel(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/user-levels/:id', Auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userLevelController.getUserLevel(req, res);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
//# sourceMappingURL=userLevelRoutes.js.map