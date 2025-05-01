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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = process.env.STRATEGY_ENGINE_URL || 'http://localhost:4000';
describe('Strategy Engine API', () => {
    let authToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Login to get auth token
        const response = yield axios_1.default.post(`${API_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        authToken = response.data.token;
    }));
    describe('Strategy Execution', () => {
        it('should execute a strategy successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = {
                strategyId: 'test-strategy',
                userId: 'test-user',
                parameters: {
                    symbol: 'BTC/USDT',
                    timeframe: '1h',
                    riskLevel: 'medium'
                }
            };
            const response = yield axios_1.default.post(`${API_URL}/strategies/execute`, request, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.executionId).toBeDefined();
            expect(response.data.status).toBe('pending');
        }));
        it('should handle invalid strategy ID', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const request = {
                strategyId: 'invalid-strategy',
                userId: 'test-user',
                parameters: {}
            };
            try {
                yield axios_1.default.post(`${API_URL}/strategies/execute`, request, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    expect((_a = error.response) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                    expect((_b = error.response) === null || _b === void 0 ? void 0 : _b.data.error).toBeDefined();
                }
            }
        }));
        it('should track strategy performance', () => __awaiter(void 0, void 0, void 0, function* () {
            const executionId = 'test-execution-id';
            const response = yield axios_1.default.get(`${API_URL}/strategies/${executionId}/performance`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('totalProfit');
            expect(response.data).toHaveProperty('monthlyReturn');
            expect(response.data).toHaveProperty('maxDrawdown');
            expect(response.data).toHaveProperty('sharpeRatio');
        }));
    });
    describe('Order Management', () => {
        it('should create and track an order', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderRequest = {
                strategyId: 'test-strategy',
                symbol: 'BTC/USDT',
                side: 'buy',
                type: 'limit',
                price: 50000,
                quantity: 0.1
            };
            const response = yield axios_1.default.post(`${API_URL}/orders`, orderRequest, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.orderId).toBeDefined();
            expect(response.data.status).toBe('pending');
            // Check order status
            const statusResponse = yield axios_1.default.get(`${API_URL}/orders/${response.data.orderId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(statusResponse.status).toBe(200);
            expect(statusResponse.data.orderId).toBe(response.data.orderId);
        }));
        it('should cancel an order', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderId = 'test-order-id';
            const response = yield axios_1.default.post(`${API_URL}/orders/${orderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.status).toBe('cancelled');
        }));
    });
    describe('Risk Management', () => {
        it('should check position limits', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${API_URL}/risk/limits`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('maxPositionSize');
            expect(response.data).toHaveProperty('maxLeverage');
            expect(response.data).toHaveProperty('maxDrawdown');
        }));
        it('should validate risk parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const riskParams = {
                maxPositionSize: 100000,
                maxLeverage: 10,
                maxDrawdown: 0.2
            };
            const response = yield axios_1.default.post(`${API_URL}/risk/validate`, riskParams, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.isValid).toBeDefined();
            if (!response.data.isValid) {
                expect(response.data.reasons).toBeDefined();
            }
        }));
    });
    describe('Performance Monitoring', () => {
        it('should track strategy metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${API_URL}/monitoring/metrics`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('totalStrategies');
            expect(response.data).toHaveProperty('activeStrategies');
            expect(response.data).toHaveProperty('totalOrders');
            expect(response.data).toHaveProperty('successRate');
        }));
        it('should get real-time performance updates', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${API_URL}/monitoring/performance`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('strategies');
            expect(Array.isArray(response.data.strategies)).toBe(true);
        }));
    });
});
