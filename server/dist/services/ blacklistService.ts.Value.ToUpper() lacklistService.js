"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistService = exports.BlacklistService = void 0;
const Blacklist_1 = require("../models/Blacklist");
const errors_1 = require("../utils/errors");
class BlacklistService {
    constructor() {
        this.blacklistModel = Blacklist_1.Blacklist;
    }
    static getInstance() {
        if (!BlacklistService.instance) {
            BlacklistService.instance = new BlacklistService();
        }
        return BlacklistService.instance;
    }
    // 获取所有黑名单条目
    async getAllEntries() {
        return await this.blacklistModel.find().sort({ createdAt: -1 });
    }
    // 获取单个黑名单条目
    async getEntryById(id) {
        const entry = await this.blacklistModel.findById(id);
        if (!entry) {
            throw new errors_1.NotFoundError('Blacklist entry not found');
        }
        return entry;
    }
    // 创建黑名单条目
    async createEntry(entryData) {
        const entry = new this.blacklistModel(entryData);
        return await entry.save();
    }
    // 更新黑名单条目
    async updateEntry(id, entryData) {
        const entry = await this.blacklistModel.findByIdAndUpdate(id, { ...entryData, updatedAt: new Date() }, { new: true, runValidators: true });
        if (!entry) {
            throw new errors_1.NotFoundError('Blacklist entry not found');
        }
        return entry;
    }
    // 删除黑名单条目
    async deleteEntry(id) {
        const entry = await this.blacklistModel.findByIdAndDelete(id);
        if (!entry) {
            throw new errors_1.NotFoundError('Blacklist entry not found');
        }
    }
    // 搜索黑名单条目
    async searchEntries(query) {
        return await this.blacklistModel.find({
            $or: [
                { userId: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { reason: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });
    }
    async addToBlacklist(data) {
        return this.blacklistModel.create(data);
    }
    async removeFromBlacklist(id) {
        const result = await this.blacklistModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
    async getBlacklistEntry(id) {
        return this.blacklistModel.findById(id);
    }
    async getAllBlacklistEntries() {
        return this.blacklistModel.find();
    }
    async isBlacklisted(userId) {
        const entry = await this.blacklistModel.findOne({ userId });
        return !!entry;
    }
    async updateBlacklistEntry(id, data) {
        return this.blacklistModel.findOneAndUpdate({ _id: id }, data, { new: true });
    }
}
exports.BlacklistService = BlacklistService;
exports.blacklistService = BlacklistService.getInstance();
//# sourceMappingURL=%20blacklistService.ts.Value.ToUpper()%20lacklistService.js.map