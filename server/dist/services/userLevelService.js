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
exports.UserLevelService = void 0;
const mongoose_1 = require("mongoose");
const UserLevel_1 = require("../models/UserLevel");
class UserLevelService {
    getUserLevelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserLevel_1.UserLevel.findById(id);
        });
    }
    updateUserLevel(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserLevel_1.UserLevel.findByIdAndUpdate(id, data, { new: true });
        });
    }
    getAllUserLevels() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserLevel_1.UserLevel.find();
        });
    }
    createUserLevel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userLevel = new UserLevel_1.UserLevel(Object.assign(Object.assign({}, data), { _id: new mongoose_1.Types.ObjectId() }));
            return yield userLevel.save();
        });
    }
    deleteUserLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield UserLevel_1.UserLevel.findByIdAndDelete(id);
            return result !== null;
        });
    }
}
exports.UserLevelService = UserLevelService;
//# sourceMappingURL=UserLevelService.js.map