"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelService = void 0;
const mongoose_1 = require("mongoose");
const UserLevel_1 = require("../models/UserLevel");
class UserLevelService {
    async getUserLevelById(id) {
        return await UserLevel_1.UserLevel.findById(id);
    }
    async updateUserLevel(id, data) {
        return await UserLevel_1.UserLevel.findByIdAndUpdate(id, data, { new: true });
    }
    async getAllUserLevels() {
        return await UserLevel_1.UserLevel.find();
    }
    async createUserLevel(data) {
        const userLevel = new UserLevel_1.UserLevel({
            ...data,
            _id: new mongoose_1.Types.ObjectId()
        });
        return await userLevel.save();
    }
    async deleteUserLevel(id) {
        const result = await UserLevel_1.UserLevel.findByIdAndDelete(id);
        return result !== null;
    }
}
exports.UserLevelService = UserLevelService;
//# sourceMappingURL=UserLevelService.js.map