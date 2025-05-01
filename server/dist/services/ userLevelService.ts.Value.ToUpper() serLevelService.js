"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelService = void 0;
const UserLevel_1 = require("../models/UserLevel");
const logger_1 = require("../utils/logger");
class UserLevelService {
    constructor() { }
    static getInstance() {
        if (!UserLevelService.instance) {
            UserLevelService.instance = new UserLevelService();
        }
        return UserLevelService.instance;
    }
    async createUserLevel(data) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const userLevel = new UserLevel_1.UserLevel({
                ...data,
                benefits: {
                    commissionRate: ((_a = data.benefits) === null || _a === void 0 ? void 0 : _a.commissionRate) || 0.1,
                    maxLeverage: ((_b = data.benefits) === null || _b === void 0 ? void 0 : _b.maxLeverage) || 1,
                    prioritySupport: ((_c = data.benefits) === null || _c === void 0 ? void 0 : _c.prioritySupport) || false,
                    customFeatures: ((_d = data.benefits) === null || _d === void 0 ? void 0 : _d.customFeatures) || [],
                    withdrawalLimit: ((_e = data.benefits) === null || _e === void 0 ? void 0 : _e.withdrawalLimit) || 0,
                    strategyLimit: ((_f = data.benefits) === null || _f === void 0 ? void 0 : _f.strategyLimit) || 0
                }
            });
            await userLevel.save();
            return userLevel.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error creating user level:', error);
            throw error;
        }
    }
    async getUserLevels() {
        try {
            const userLevels = await UserLevel_1.UserLevel.find().sort({ level: 1 });
            return userLevels.map(level => level.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting user levels:', error);
            throw error;
        }
    }
    async updateUserLevel(id, data) {
        try {
            const userLevel = await UserLevel_1.UserLevel.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
            return userLevel === null || userLevel === void 0 ? void 0 : userLevel.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error updating user level:', error);
            throw error;
        }
    }
    async getUserLevelById(id) {
        const userLevel = await UserLevel_1.UserLevel.findById(id);
        return userLevel === null || userLevel === void 0 ? void 0 : userLevel.toObject();
    }
    async deleteUserLevel(id) {
        const result = await UserLevel_1.UserLevel.findByIdAndDelete(id);
        return result === null || result === void 0 ? void 0 : result.toObject();
    }
    async addExperience(userId, amount) {
        const userLevel = await UserLevel_1.UserLevel.findOne({ userId });
        if (!userLevel) {
            throw new Error('User level not found');
        }
        const newExperience = userLevel.experience + amount;
        const requiredExperience = userLevel.requiredExperience;
        const newLevel = Math.floor(newExperience / requiredExperience) + 1;
        const updatedUserLevel = await UserLevel_1.UserLevel.findOneAndUpdate({ userId }, {
            $set: {
                experience: newExperience,
                level: newLevel
            }
        }, { new: true });
        return updatedUserLevel === null || updatedUserLevel === void 0 ? void 0 : updatedUserLevel.toObject();
    }
    async getUserLevelInfo(userId) {
        const userLevel = await UserLevel_1.UserLevel.findOne({ userId });
        if (!userLevel) {
            throw new Error('User level not found');
        }
        return {
            level: userLevel.level,
            experience: userLevel.experience,
            requiredExperience: userLevel.requiredExperience,
            progress: (userLevel.experience % userLevel.requiredExperience) / userLevel.requiredExperience * 100,
            benefits: {
                ...userLevel.benefits,
                withdrawalLimit: userLevel.benefits.withdrawalLimit || 0,
                strategyLimit: userLevel.benefits.strategyLimit || 0
            }
        };
    }
    async getUserLevel(userId) {
        try {
            const userLevel = await UserLevel_1.UserLevel.findOne({ userId });
            return userLevel === null || userLevel === void 0 ? void 0 : userLevel.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error getting user level:', error);
            throw error;
        }
    }
    async getAllUserLevels() {
        const userLevels = await UserLevel_1.UserLevel.find();
        return userLevels.map(level => level.toObject());
    }
    async getUserLevelByUserId(userId) {
        const userLevel = await UserLevel_1.UserLevel.findOne({ userId });
        return userLevel === null || userLevel === void 0 ? void 0 : userLevel.toObject();
    }
    async updateByUserId(userId, data) {
        const userLevel = await UserLevel_1.UserLevel.findOneAndUpdate({ userId }, data, { new: true, upsert: true });
        return userLevel === null || userLevel === void 0 ? void 0 : userLevel.toObject();
    }
}
exports.UserLevelService = UserLevelService;
//# sourceMappingURL=%20userLevelService.ts.Value.ToUpper()%20serLevelService.js.map