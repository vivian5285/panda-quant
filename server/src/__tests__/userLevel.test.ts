import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose, { Types } from 'mongoose';
import { UserLevel } from '../models/UserLevel';
import { UserLevelService } from '../services/UserLevelService';

describe('UserLevel Service', () => {
  let userLevelService: UserLevelService;
  let userId: Types.ObjectId;

  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');
    userLevelService = UserLevelService.getInstance();
    userId = new Types.ObjectId();
  });

  afterEach(async () => {
    await UserLevel.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create a new user level', async () => {
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
    expect(level).toBeDefined();
    expect(level.name).toBe(levelData.name);
    expect(level.benefits).toEqual(levelData.benefits);
  });

  it('should get all user levels', async () => {
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
    expect(levels).toHaveLength(1);
  });

  it('should get a user level by id', async () => {
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
    expect(level).toBeDefined();
    expect(level.name).toBe(levelData.name);
  });

  it('should update a user level', async () => {
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
    expect(updatedLevel.name).toBe('Super VIP');
  });

  it('should delete a user level', async () => {
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
    expect(levels).toHaveLength(0);
  });

  it('should create a user level', async () => {
    const userLevel = await UserLevel.create({
      userId,
      level: 1,
      experience: 0
    });

    expect(userLevel).toBeDefined();
    expect(userLevel.level).toBe(1);
  });

  it('should get user level', async () => {
    const level = await userLevelService.getUserLevel(userId.toString());
    expect(level).toBeDefined();
  });
}); 