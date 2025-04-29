import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { connect, disconnect } from '../config/database';
import { strategyRatingController } from '../controllers/strategyRatingController';
import { StrategyRating } from '../models/StrategyRating';
import { User } from '../models/User';
import { Strategy } from '../models/Strategy';
import { Types } from 'mongoose';

describe('StrategyRating Controller', () => {
  let controller: strategyRatingController;
  let testUser: any;
  let testStrategy: any;
  let userId: Types.ObjectId;
  let strategyId: Types.ObjectId;

  beforeEach(async () => {
    await connect();
    controller = new strategyRatingController();

    // 创建测试用户
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    // 创建测试策略
    testStrategy = await Strategy.create({
      name: 'Test Strategy',
      description: 'Test Description',
      creator: testUser._id,
      status: 'active'
    });

    userId = new Types.ObjectId();
    strategyId = new Types.ObjectId();
  });

  afterEach(async () => {
    await StrategyRating.deleteMany({});
    await User.deleteMany({});
    await Strategy.deleteMany({});
    await disconnect();
  });

  it('should create a new rating', async () => {
    const req = {
      body: {
        strategyId: testStrategy._id,
        rating: 5,
        comment: 'Great strategy!'
      },
      user: testUser
    } as any;

    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          expect(code).toBe(201);
          expect(data.rating).toBe(5);
          expect(data.comment).toBe('Great strategy!');
          expect(data.user).toBe(testUser._id.toString());
          expect(data.strategy).toBe(testStrategy._id.toString());
        }
      })
    } as any;

    await controller.createRating(req, res);
  });

  it('should not allow duplicate ratings', async () => {
    const req = {
      body: {
        strategyId: testStrategy._id,
        rating: 5,
        comment: 'First rating'
      },
      user: testUser
    } as any;

    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          expect(code).toBe(201);
        }
      })
    } as any;

    await controller.createRating(req, res);

    // 尝试创建重复评分
    const duplicateReq = {
      body: {
        strategyId: testStrategy._id,
        rating: 4,
        comment: 'Second rating'
      },
      user: testUser
    } as any;

    const errorRes = {
      status: (code: number) => ({
        json: (data: any) => {
          expect(code).toBe(400);
          expect(data.error).toBe('User has already rated this strategy');
        }
      })
    } as any;

    await controller.createRating(duplicateReq, errorRes);
  });

  it('should get all ratings for a strategy', async () => {
    // 创建多个评分
    await StrategyRating.create([
      {
        user: testUser._id,
        strategy: testStrategy._id,
        rating: 5,
        comment: 'First rating'
      },
      {
        user: testUser._id,
        strategy: testStrategy._id,
        rating: 4,
        comment: 'Second rating'
      }
    ]);

    const req = {
      params: { strategyId: testStrategy._id }
    } as any;

    const res = {
      json: (data: any) => {
        expect(data.length).toBe(2);
        expect(data[0].rating).toBe(5);
        expect(data[1].rating).toBe(4);
      }
    } as any;

    await controller.getStrategyRatings(req, res);
  });

  it('should get average rating for a strategy', async () => {
    // 创建多个评分
    await StrategyRating.create([
      {
        user: testUser._id,
        strategy: testStrategy._id,
        rating: 5,
        comment: 'First rating'
      },
      {
        user: testUser._id,
        strategy: testStrategy._id,
        rating: 4,
        comment: 'Second rating'
      }
    ]);

    const req = {
      params: { strategyId: testStrategy._id }
    } as any;

    const res = {
      json: (data: any) => {
        expect(data.averageRating).toBe(4.5);
      }
    } as any;

    await controller.getAverageRating(req, res);
  });

  it('should update a rating', async () => {
    // 创建初始评分
    const rating = await StrategyRating.create({
      user: testUser._id,
      strategy: testStrategy._id,
      rating: 3,
      comment: 'Initial rating'
    });

    const req = {
      params: { id: rating._id },
      body: {
        rating: 5,
        comment: 'Updated rating'
      },
      user: testUser
    } as any;

    const res = {
      json: (data: any) => {
        expect(data.rating).toBe(5);
        expect(data.comment).toBe('Updated rating');
      }
    } as any;

    await controller.updateRating(req, res);
  });

  it('should delete a rating', async () => {
    // 创建初始评分
    const rating = await StrategyRating.create({
      user: testUser._id,
      strategy: testStrategy._id,
      rating: 3,
      comment: 'Initial rating'
    });

    const req = {
      params: { id: rating._id },
      user: testUser
    } as any;

    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          expect(code).toBe(200);
          expect(data.message).toBe('Rating deleted successfully');
        }
      })
    } as any;

    await controller.deleteRating(req, res);

    // 验证评分已被删除
    const deletedRating = await StrategyRating.findById(rating._id);
    expect(deletedRating).toBeNull();
  });

  it('should create a rating', async () => {
    const rating = await StrategyRating.create({
      userId,
      strategyId,
      rating: 5,
      comment: 'Great strategy!'
    });

    expect(rating).toBeDefined();
    expect(rating.rating).toBe(5);
  });

  it('should get strategy ratings', async () => {
    const ratings = await StrategyRating.find({ strategyId });
    expect(Array.isArray(ratings)).toBe(true);
  });
}); 