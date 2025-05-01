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
const commissionRule_1 = require("../models/commissionRule");
const commissionRecord_1 = require("../models/commissionRecord");
const User_1 = require("../models/User");
const Order_1 = require("../models/Order");
const commissionService_1 = require("../services/commissionService");
(0, vitest_1.describe)('Commission Service', () => {
    let testUser;
    let testOrder;
    let commissionService;
    let userId;
    (0, vitest_1.beforeEach)(async () => {
        await mongoose_1.default.connect('mongodb://localhost:27017/test');
        testUser = new User_1.User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            levelId: new mongoose_1.default.Types.ObjectId()
        });
        await testUser.save();
        testOrder = new Order_1.Order({
            userId: testUser._id,
            amount: 1000,
            status: 'completed'
        });
        await testOrder.save();
        commissionService = commissionService_1.CommissionService.getInstance();
        userId = new mongoose_1.Types.ObjectId();
    });
    (0, vitest_1.afterEach)(async () => {
        await commissionRule_1.CommissionRule.deleteMany({});
        await commissionRecord_1.CommissionRecord.deleteMany({});
        await User_1.User.deleteMany({});
        await Order_1.Order.deleteMany({});
        await mongoose_1.default.connection.close();
    });
    (0, vitest_1.it)('should calculate commission based on percentage rule', async () => {
        const rule = new commissionRule_1.CommissionRule({
            name: 'Test Percentage Rule',
            type: 'percentage',
            value: 10,
            status: 'active'
        });
        await rule.save();
        const commission = await commissionService.calculateCommission(testOrder, testUser);
        (0, vitest_1.expect)(commission).toBe(100);
    });
    (0, vitest_1.it)('should calculate commission based on fixed rule', async () => {
        const rule = new commissionRule_1.CommissionRule({
            name: 'Test Fixed Rule',
            type: 'fixed',
            value: 50,
            status: 'active'
        });
        await rule.save();
        const commission = await commissionService.calculateCommission(testOrder, testUser);
        (0, vitest_1.expect)(commission).toBe(50);
    });
    (0, vitest_1.it)('should apply min/max amount constraints', async () => {
        const rule = new commissionRule_1.CommissionRule({
            name: 'Test Constrained Rule',
            type: 'percentage',
            value: 10,
            minAmount: 100,
            maxAmount: 200,
            status: 'active'
        });
        await rule.save();
        const commission = await commissionService.calculateCommission(testOrder, testUser);
        (0, vitest_1.expect)(commission).toBe(200);
    });
    (0, vitest_1.it)('should create commission record', async () => {
        const commission = 100;
        await commissionService.createCommissionRecord(testOrder, testUser, commission);
        const record = await commissionRecord_1.CommissionRecord.findOne({ orderId: testOrder._id });
        (0, vitest_1.expect)(record).toBeDefined();
        (0, vitest_1.expect)(record.amount).toBe(commission);
        (0, vitest_1.expect)(record.status).toBe('pending');
    });
    (0, vitest_1.it)('should distribute commission', async () => {
        const commission = 100;
        await commissionService.createCommissionRecord(testOrder, testUser, commission);
        const record = await commissionRecord_1.CommissionRecord.findOne({ orderId: testOrder._id });
        await commissionService.distributeCommission(record._id);
        const updatedRecord = await commissionRecord_1.CommissionRecord.findById(record._id);
        const updatedUser = await User_1.User.findById(testUser._id);
        (0, vitest_1.expect)(updatedRecord.status).toBe('distributed');
        (0, vitest_1.expect)(updatedUser.commissionBalance).toBe(commission);
    });
    (0, vitest_1.it)('should get commission history', async () => {
        const commission = 100;
        await commissionService.createCommissionRecord(testOrder, testUser, commission);
        await commissionService.distributeCommission((await commissionRecord_1.CommissionRecord.findOne({ orderId: testOrder._id }))._id);
        const history = await commissionService.getCommissionHistory(testUser._id);
        (0, vitest_1.expect)(history).toHaveLength(1);
        (0, vitest_1.expect)(history[0].amount).toBe(commission);
    });
    (0, vitest_1.it)('should calculate total commission', async () => {
        const commission = 100;
        await commissionService.createCommissionRecord(testOrder, testUser, commission);
        await commissionService.distributeCommission((await commissionRecord_1.CommissionRecord.findOne({ orderId: testOrder._id }))._id);
        const total = await commissionService.getTotalCommission(testUser._id);
        (0, vitest_1.expect)(total).toBe(commission);
    });
    (0, vitest_1.it)('should calculate commission for a user', async () => {
        const amount = 1000;
        const commission = await commissionService.calculateCommission(userId.toString(), amount);
        (0, vitest_1.expect)(commission).toBe(100);
    });
    (0, vitest_1.it)('should create a commission record', async () => {
        const data = {
            userId,
            amount: 100,
            status: 'pending'
        };
        const record = await commissionService.createCommission(data);
        (0, vitest_1.expect)(record).toBeDefined();
        (0, vitest_1.expect)(record.amount).toBe(100);
    });
    (0, vitest_1.it)('should get user commissions', async () => {
        const commissions = await commissionService.getUserCommissions(userId.toString());
        (0, vitest_1.expect)(Array.isArray(commissions)).toBe(true);
    });
});
//# sourceMappingURL=commission.test.js.map