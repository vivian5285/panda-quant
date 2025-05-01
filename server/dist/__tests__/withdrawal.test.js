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
const commissionWithdrawal_1 = require("../models/commissionWithdrawal");
const User_1 = require("../models/User");
const withdrawalService_1 = require("../services/withdrawalService");
(0, vitest_1.describe)('Withdrawal Service', () => {
    let testUser;
    let withdrawalService;
    let userId;
    let testWithdrawal;
    (0, vitest_1.beforeEach)(async () => {
        await mongoose_1.default.connect('mongodb://localhost:27017/test');
        testUser = new User_1.User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            commissionBalance: 1000
        });
        await testUser.save();
        withdrawalService = withdrawalService_1.WithdrawalService.getInstance();
        userId = new mongoose_1.Types.ObjectId();
    });
    (0, vitest_1.afterEach)(async () => {
        await commissionWithdrawal_1.CommissionWithdrawal.deleteMany({});
        await User_1.User.deleteMany({});
        await mongoose_1.default.connection.close();
    });
    (0, vitest_1.it)('should create withdrawal request', async () => {
        const amount = 500;
        const paymentMethod = 'bank_transfer';
        const paymentDetails = {
            accountNumber: '123456789',
            bankName: 'Test Bank',
            swiftCode: 'TEST123'
        };
        const withdrawal = await withdrawalService.createWithdrawalRequest(testUser._id, amount, paymentMethod, paymentDetails);
        (0, vitest_1.expect)(withdrawal).toBeDefined();
        (0, vitest_1.expect)(withdrawal.userId.toString()).toBe(testUser._id.toString());
        (0, vitest_1.expect)(withdrawal.amount).toBe(amount);
        (0, vitest_1.expect)(withdrawal.status).toBe('pending');
        (0, vitest_1.expect)(withdrawal.paymentMethod).toBe(paymentMethod);
        (0, vitest_1.expect)(withdrawal.paymentDetails).toEqual(paymentDetails);
        testWithdrawal = withdrawal;
    });
    (0, vitest_1.it)('should not create withdrawal request with insufficient balance', async () => {
        const amount = 1500;
        const paymentMethod = 'bank_transfer';
        const paymentDetails = {
            accountNumber: '123456789',
            bankName: 'Test Bank',
            swiftCode: 'TEST123'
        };
        await (0, vitest_1.expect)(withdrawalService.createWithdrawalRequest(testUser._id, amount, paymentMethod, paymentDetails)).rejects.toThrow('Insufficient commission balance');
    });
    (0, vitest_1.it)('should process withdrawal request', async () => {
        const withdrawal = await withdrawalService.processWithdrawal(testWithdrawal._id, 'approved', 'Approved by admin');
        (0, vitest_1.expect)(withdrawal).toBeDefined();
        (0, vitest_1.expect)(withdrawal.status).toBe('approved');
        (0, vitest_1.expect)(withdrawal.adminComment).toBe('Approved by admin');
    });
    (0, vitest_1.it)('should reject withdrawal request', async () => {
        const withdrawal = await withdrawalService.processWithdrawal(testWithdrawal._id, 'rejected', 'Invalid bank details');
        (0, vitest_1.expect)(withdrawal).toBeDefined();
        (0, vitest_1.expect)(withdrawal.status).toBe('rejected');
        (0, vitest_1.expect)(withdrawal.adminComment).toBe('Invalid bank details');
    });
    (0, vitest_1.it)('should complete withdrawal request', async () => {
        const withdrawal = await withdrawalService.completeWithdrawal(testWithdrawal._id);
        (0, vitest_1.expect)(withdrawal).toBeDefined();
        (0, vitest_1.expect)(withdrawal.status).toBe('completed');
    });
    (0, vitest_1.it)('should get withdrawal history', async () => {
        const history = await withdrawalService.getWithdrawalHistory(testUser._id);
        (0, vitest_1.expect)(history).toBeDefined();
        (0, vitest_1.expect)(Array.isArray(history)).toBe(true);
        (0, vitest_1.expect)(history.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(history[0].userId.toString()).toBe(testUser._id.toString());
    });
    (0, vitest_1.it)('should get withdrawal stats', async () => {
        const requests = [
            { amount: 300, status: 'pending' },
            { amount: 200, status: 'approved' },
            { amount: 100, status: 'rejected' },
            { amount: 400, status: 'completed' }
        ];
        for (const request of requests) {
            const withdrawal = new commissionWithdrawal_1.CommissionWithdrawal({
                userId: testUser._id,
                amount: request.amount,
                paymentMethod: 'bank_transfer',
                paymentDetails: { accountNumber: '123456789' },
                status: request.status
            });
            await withdrawal.save();
        }
        const stats = await withdrawalService.getWithdrawalStats(testUser._id);
        (0, vitest_1.expect)(stats.pendingWithdrawals).toBe(1);
        (0, vitest_1.expect)(stats.completedWithdrawals).toBe(1);
        (0, vitest_1.expect)(stats.totalWithdrawn).toBe(400);
    });
    (0, vitest_1.it)('should get pending withdrawals', async () => {
        const pendingWithdrawals = await withdrawalService.getPendingWithdrawals();
        (0, vitest_1.expect)(pendingWithdrawals).toBeDefined();
        (0, vitest_1.expect)(Array.isArray(pendingWithdrawals)).toBe(true);
        pendingWithdrawals.forEach(withdrawal => {
            (0, vitest_1.expect)(withdrawal.status).toBe('pending');
        });
    });
    (0, vitest_1.it)('should get withdrawals', async () => {
        const withdrawals = await withdrawalService.getWithdrawals(testUser._id);
        (0, vitest_1.expect)(withdrawals).toBeDefined();
        (0, vitest_1.expect)(Array.isArray(withdrawals)).toBe(true);
        withdrawals.forEach(withdrawal => {
            (0, vitest_1.expect)(withdrawal.userId.toString()).toBe(testUser._id.toString());
        });
    });
    (0, vitest_1.it)('should update withdrawal status', async () => {
        const withdrawal = await withdrawalService.updateWithdrawalStatus(testWithdrawal._id, 'rejected', 'Rejected by admin');
        (0, vitest_1.expect)(withdrawal).toBeDefined();
        (0, vitest_1.expect)(withdrawal.status).toBe('rejected');
        (0, vitest_1.expect)(withdrawal.adminComment).toBe('Rejected by admin');
    });
});
//# sourceMappingURL=withdrawal.test.js.map