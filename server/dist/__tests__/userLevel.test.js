"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mongoose_1 = __importStar(require("mongoose"));
const UserLevel_1 = require("../models/UserLevel");
const userLevelService_1 = require("../services/userLevelService");
(0, vitest_1.describe)('UserLevel Service', () => {
    let userLevelService;
    let userId;
    (0, vitest_1.beforeEach)(async () => {
        await mongoose_1.default.connect('mongodb://localhost:27017/test');
        userLevelService = userLevelService_1.UserLevelService.getInstance();
        userId = new mongoose_1.Types.ObjectId();
    });
    (0, vitest_1.afterEach)(async () => {
        await UserLevel_1.UserLevel.deleteMany({});
        await mongoose_1.default.connection.close();
    });
    (0, vitest_1.it)('should create a new user level', async () => {
        const levelData = {
            name: 'VIP',
            description: 'VIP用户等级',
            benefits: ['降低手续费', '专属客服'],
            requirements: {
                minBalance: 1000,
                minTradingVolume: 10000,
                minHoldingTime: 30
            }
        };
        const level = await userLevelService.createLevel(levelData);
        (0, vitest_1.expect)(level).toBeDefined();
        (0, vitest_1.expect)(level.name).toBe(levelData.name);
        (0, vitest_1.expect)(level.benefits).toEqual(levelData.benefits);
    });
    (0, vitest_1.it)('should get all user levels', async () => {
        const levelData = {
            name: 'VIP',
            description: 'VIP用户等级',
            benefits: ['降低手续费', '专属客服'],
            requirements: {
                minBalance: 1000,
                minTradingVolume: 10000,
                minHoldingTime: 30
            }
        };
        await userLevelService.createLevel(levelData);
        const levels = await userLevelService.getAllLevels();
        (0, vitest_1.expect)(levels).toHaveLength(1);
    });
    (0, vitest_1.it)('should get a user level by id', async () => {
        const levelData = {
            name: 'VIP',
            description: 'VIP用户等级',
            benefits: ['降低手续费', '专属客服'],
            requirements: {
                minBalance: 1000,
                minTradingVolume: 10000,
                minHoldingTime: 30
            }
        };
        const createdLevel = await userLevelService.createLevel(levelData);
        const level = await userLevelService.getLevelById(createdLevel._id);
        (0, vitest_1.expect)(level).toBeDefined();
        (0, vitest_1.expect)(level.name).toBe(levelData.name);
    });
    (0, vitest_1.it)('should update a user level', async () => {
        const levelData = {
            name: 'VIP',
            description: 'VIP用户等级',
            benefits: ['降低手续费', '专属客服'],
            requirements: {
                minBalance: 1000,
                minTradingVolume: 10000,
                minHoldingTime: 30
            }
        };
        const createdLevel = await userLevelService.createLevel(levelData);
        const updatedLevel = await userLevelService.updateLevel(createdLevel._id, {
            name: 'Super VIP'
        });
        (0, vitest_1.expect)(updatedLevel.name).toBe('Super VIP');
    });
    (0, vitest_1.it)('should delete a user level', async () => {
        const levelData = {
            name: 'VIP',
            description: 'VIP用户等级',
            benefits: ['降低手续费', '专属客服'],
            requirements: {
                minBalance: 1000,
                minTradingVolume: 10000,
                minHoldingTime: 30
            }
        };
        const createdLevel = await userLevelService.createLevel(levelData);
        await userLevelService.deleteLevel(createdLevel._id);
        const levels = await userLevelService.getAllLevels();
        (0, vitest_1.expect)(levels).toHaveLength(0);
    });
    (0, vitest_1.it)('should create a user level', async () => {
        const userLevel = await UserLevel_1.UserLevel.create({
            userId,
            level: 1,
            experience: 0
        });
        (0, vitest_1.expect)(userLevel).toBeDefined();
        (0, vitest_1.expect)(userLevel.level).toBe(1);
    });
    (0, vitest_1.it)('should get user level', async () => {
        const level = await userLevelService.getUserLevel(userId.toString());
        (0, vitest_1.expect)(level).toBeDefined();
    });
});
//# sourceMappingURL=userLevel.test.js.map