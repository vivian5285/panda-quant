"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelController = void 0;
const userLevelService_1 = require("../services/userLevelService");
const logger_1 = require("../utils/logger");
class UserLevelController {
    constructor() {
        this.userLevelService = new userLevelService_1.UserLevelService();
    }
    // 获取所有用户等级
    async getAllLevels(_req, res) {
        try {
            const levels = await this.userLevelService.getAllUserLevels();
            res.json(levels);
        }
        catch (error) {
            logger_1.logger.error('Error getting all levels:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // 获取单个用户等级
    async getUserLevel(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const userId = req.user._id.toString();
            const userLevel = await this.userLevelService.getUserLevelById(userId);
            res.json(userLevel);
        }
        catch (error) {
            res.status(500).json({ message: 'Error getting user level', error });
        }
    }
    // 创建用户等级
    async createLevel(req, res) {
        try {
            const level = await this.userLevelService.createUserLevel(req.body);
            res.status(201).json(level);
        }
        catch (error) {
            logger_1.logger.error('Error creating level:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // 更新用户等级
    async updateLevel(req, res) {
        try {
            const { id } = req.params;
            const level = await this.userLevelService.updateUserLevel(id, req.body);
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
    }
    // 删除用户等级
    async deleteLevel(req, res) {
        try {
            const { id } = req.params;
            const success = await this.userLevelService.deleteUserLevel(id);
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
    }
    async addExperience(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const userId = req.user._id.toString();
            const { amount } = req.body;
            const updatedUserLevel = await this.userLevelService.updateUserLevel(userId, { experience: amount });
            res.json(updatedUserLevel);
        }
        catch (error) {
            res.status(500).json({ message: 'Error adding experience', error });
        }
    }
    async getUserLevelInfo(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const userId = req.user._id.toString();
            const levelInfo = await this.userLevelService.getUserLevelById(userId);
            res.json(levelInfo);
        }
        catch (error) {
            res.status(500).json({ message: 'Error getting user level info', error });
        }
    }
}
exports.UserLevelController = UserLevelController;
//# sourceMappingURL=userLevelController.js.map