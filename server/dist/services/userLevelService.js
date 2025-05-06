import { Types } from 'mongoose';
import { UserLevel } from '../models/UserLevel';
export class UserLevelService {
    async getUserLevelById(id) {
        return await UserLevel.findById(id);
    }
    async updateUserLevel(id, data) {
        return await UserLevel.findByIdAndUpdate(id, data, { new: true });
    }
    async getAllUserLevels() {
        return await UserLevel.find();
    }
    async createUserLevel(data) {
        const userLevel = new UserLevel({
            ...data,
            _id: new Types.ObjectId()
        });
        return await userLevel.save();
    }
    async deleteUserLevel(id) {
        const result = await UserLevel.findByIdAndDelete(id);
        return result !== null;
    }
}
//# sourceMappingURL=UserLevelService.js.map