"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const database_1 = require("../config/database");
const strategyRatingController_1 = require("../controllers/strategyRatingController");
const StrategyRating_1 = require("../models/StrategyRating");
const User_1 = require("../models/User");
const Strategy_1 = require("../models/Strategy");
const mongoose_1 = require("mongoose");
(0, vitest_1.describe)('StrategyRating Controller', () => {
    let controller;
    let testUser;
    let testStrategy;
    let userId;
    let strategyId;
    (0, vitest_1.beforeEach)(async () => {
        await (0, database_1.connect)();
        controller = new strategyRatingController_1.strategyRatingController();
        testUser = await User_1.User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'user'
        });
        testStrategy = await Strategy_1.Strategy.create({
            name: 'Test Strategy',
            description: 'Test Description',
            creator: testUser._id,
            status: 'active'
        });
        userId = new mongoose_1.Types.ObjectId();
        strategyId = new mongoose_1.Types.ObjectId();
    });
    (0, vitest_1.afterEach)(async () => {
        await StrategyRating_1.StrategyRating.deleteMany({});
        await User_1.User.deleteMany({});
        await Strategy_1.Strategy.deleteMany({});
        await (0, database_1.disconnect)();
    });
    (0, vitest_1.it)('should create a new rating', async () => {
        const req = {
            body: {
                strategyId: testStrategy._id,
                rating: 5,
                comment: 'Great strategy!'
            },
            user: testUser
        };
        const res = {
            status: (code) => ({
                json: (data) => {
                    (0, vitest_1.expect)(code).toBe(201);
                    (0, vitest_1.expect)(data.rating).toBe(5);
                    (0, vitest_1.expect)(data.comment).toBe('Great strategy!');
                    (0, vitest_1.expect)(data.user).toBe(testUser._id.toString());
                    (0, vitest_1.expect)(data.strategy).toBe(testStrategy._id.toString());
                }
            })
        };
        await controller.createRating(req, res);
    });
    (0, vitest_1.it)('should not allow duplicate ratings', async () => {
        const req = {
            body: {
                strategyId: testStrategy._id,
                rating: 5,
                comment: 'First rating'
            },
            user: testUser
        };
        const res = {
            status: (code) => ({
                json: (data) => {
                    (0, vitest_1.expect)(code).toBe(201);
                }
            })
        };
        await controller.createRating(req, res);
        const duplicateReq = {
            body: {
                strategyId: testStrategy._id,
                rating: 4,
                comment: 'Second rating'
            },
            user: testUser
        };
        const errorRes = {
            status: (code) => ({
                json: (data) => {
                    (0, vitest_1.expect)(code).toBe(400);
                    (0, vitest_1.expect)(data.error).toBe('User has already rated this strategy');
                }
            })
        };
        await controller.createRating(duplicateReq, errorRes);
    });
    (0, vitest_1.it)('should get all ratings for a strategy', async () => {
        await StrategyRating_1.StrategyRating.create([
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
        };
        const res = {
            json: (data) => {
                (0, vitest_1.expect)(data.length).toBe(2);
                (0, vitest_1.expect)(data[0].rating).toBe(5);
                (0, vitest_1.expect)(data[1].rating).toBe(4);
            }
        };
        await controller.getStrategyRatings(req, res);
    });
    (0, vitest_1.it)('should get average rating for a strategy', async () => {
        await StrategyRating_1.StrategyRating.create([
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
        };
        const res = {
            json: (data) => {
                (0, vitest_1.expect)(data.averageRating).toBe(4.5);
            }
        };
        await controller.getAverageRating(req, res);
    });
    (0, vitest_1.it)('should update a rating', async () => {
        const rating = await StrategyRating_1.StrategyRating.create({
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
        };
        const res = {
            json: (data) => {
                (0, vitest_1.expect)(data.rating).toBe(5);
                (0, vitest_1.expect)(data.comment).toBe('Updated rating');
            }
        };
        await controller.updateRating(req, res);
    });
    (0, vitest_1.it)('should delete a rating', async () => {
        const rating = await StrategyRating_1.StrategyRating.create({
            user: testUser._id,
            strategy: testStrategy._id,
            rating: 3,
            comment: 'Initial rating'
        });
        const req = {
            params: { id: rating._id },
            user: testUser
        };
        const res = {
            status: (code) => ({
                json: (data) => {
                    (0, vitest_1.expect)(code).toBe(200);
                    (0, vitest_1.expect)(data.message).toBe('Rating deleted successfully');
                }
            })
        };
        await controller.deleteRating(req, res);
        const deletedRating = await StrategyRating_1.StrategyRating.findById(rating._id);
        (0, vitest_1.expect)(deletedRating).toBeNull();
    });
    (0, vitest_1.it)('should create a rating', async () => {
        const rating = await StrategyRating_1.StrategyRating.create({
            userId,
            strategyId,
            rating: 5,
            comment: 'Great strategy!'
        });
        (0, vitest_1.expect)(rating).toBeDefined();
        (0, vitest_1.expect)(rating.rating).toBe(5);
    });
    (0, vitest_1.it)('should get strategy ratings', async () => {
        const ratings = await StrategyRating_1.StrategyRating.find({ strategyId });
        (0, vitest_1.expect)(Array.isArray(ratings)).toBe(true);
    });
});
//# sourceMappingURL=strategyRating.test.js.map