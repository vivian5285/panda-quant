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
exports.UserLevelController = void 0;
const UserLevelService_1 = require("../services/UserLevelService");
const logger_1 = require("../utils/logger");
class UserLevelController {
    constructor() {
        this.userLevelService = new UserLevelService_1.UserLevelService();
    }
    // 获取所有用户等级
    getAllLevels(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const levels = yield this.userLevelService.getAllUserLevels();
                res.json(levels);
            }
            catch (error) {
                logger_1.logger.error('Error getting all levels:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // 获取单个用户等级
    getUserLevel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const userId = req.user._id.toString();
                const userLevel = yield this.userLevelService.getUserLevelById(userId);
                res.json(userLevel);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting user level', error });
            }
        });
    }
    // 创建用户等级
    createLevel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const level = yield this.userLevelService.createUserLevel(req.body);
                res.status(201).json(level);
            }
            catch (error) {
                logger_1.logger.error('Error creating level:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // 更新用户等级
    updateLevel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const level = yield this.userLevelService.updateUserLevel(id, req.body);
                if (!level) {
                    res.status(404).json({ error: 'Level not found' });
                    return;
                }
                res.json(level);
            }
            catch (error) {
                logger_1.logger.error('Error updating level:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // 删除用户等级
    deleteLevel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield this.userLevelService.deleteUserLevel(id);
                if (!success) {
                    res.status(404).json({ error: 'Level not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                logger_1.logger.error('Error deleting level:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    addExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const userId = req.user._id.toString();
                const { amount } = req.body;
                const updatedUserLevel = yield this.userLevelService.updateUserLevel(userId, { experience: amount });
                res.json(updatedUserLevel);
            }
            catch (error) {
                res.status(500).json({ message: 'Error adding experience', error });
            }
        });
    }
    getUserLevelInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const userId = req.user._id.toString();
                const levelInfo = yield this.userLevelService.getUserLevelById(userId);
                res.json(levelInfo);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting user level info', error });
            }
        });
    }
}
exports.UserLevelController = UserLevelController;
//# sourceMappingURL=userLevelController.js.map