"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelService = void 0;
const mongoose_1 = require("mongoose");
const user_level_model_1 = require("../models/user-level.model");
class UserLevelService {
    constructor() { }
    static getInstance() {
        if (!UserLevelService.instance) {
            UserLevelService.instance = new UserLevelService();
        }
        return UserLevelService.instance;
    }
    convertToIUserLevel(userLevel) {
        const userLevelObject = userLevel.toObject();
        return {
            ...userLevelObject,
            _id: userLevelObject._id.toString(),
            userId: userLevelObject.userId.toString()
        };
    }
    async getUserLevelById(id) {
        return await user_level_model_1.UserLevel.findById(id);
    }
    async updateUserLevel(id, data) {
        return await user_level_model_1.UserLevel.findByIdAndUpdate(id, data, { new: true });
    }
    async getAllUserLevels() {
        return await user_level_model_1.UserLevel.find();
    }
    async createUserLevel(data) {
        const userLevel = new user_level_model_1.UserLevel({
            ...data,
            _id: new mongoose_1.Types.ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const savedUserLevel = await userLevel.save();
        return this.convertToIUserLevel(savedUserLevel);
    }
    async deleteUserLevel(id) {
        const result = await user_level_model_1.UserLevel.findByIdAndDelete(id);
        return result !== null;
    }
}
exports.UserLevelService = UserLevelService;
//# sourceMappingURL=UserLevelService.js.map