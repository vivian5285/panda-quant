import axios from 'axios';
import { StrategyExecutionRequest, StrategyExecutionResponse } from '../../interfaces/api';

const API_URL = process.env.STRATEGY_ENGINE_URL || 'http://localhost:4000';

describe('Strategy Engine API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get auth token
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = response.data.token;
  });

  describe('Strategy Execution', () => {
    it('should execute a strategy successfully', async () => {
      const request: StrategyExecutionRequest = {
        strategyId: 'test-strategy',
        userId: 'test-user',
        parameters: {
          symbol: 'BTC/USDT',
          timeframe: '1h',
          riskLevel: 'medium'
        }
      };

      const response = await axios.post<StrategyExecutionResponse>(
        `${API_URL}/strategies/execute`,
        request,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.executionId).toBeDefined();
      expect(response.data.status).toBe('pending');
    });

    it('should handle invalid strategy ID', async () => {
      const request: StrategyExecutionRequest = {
        strategyId: 'invalid-strategy',
        userId: 'test-user',
        parameters: {}
      };

      try {
        await axios.post(`${API_URL}/strategies/execute`, request, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(400);
          expect(error.response?.data.error).toBeDefined();
        }
      }
    });

    it('should track strategy performance', async () => {
      const executionId = 'test-execution-id';
      const response = await axios.get(
        `${API_URL}/strategies/${executionId}/performance`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalProfit');
      expect(response.data).toHaveProperty('monthlyReturn');
      expect(response.data).toHaveProperty('maxDrawdown');
      expect(response.data).toHaveProperty('sharpeRatio');
    });
  });

  describe('Order Management', () => {
    it('should create and track an order', async () => {
      const orderRequest = {
        strategyId: 'test-strategy',
        symbol: 'BTC/USDT',
        side: 'buy',
        type: 'limit',
        price: 50000,
        quantity: 0.1
      };

      const response = await axios.post(
        `${API_URL}/orders`,
        orderRequest,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.orderId).toBeDefined();
      expect(response.data.status).toBe('pending');

      // Check order status
      const statusResponse = await axios.get(
        `${API_URL}/orders/${response.data.orderId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(statusResponse.status).toBe(200);
      expect(statusResponse.data.orderId).toBe(response.data.orderId);
    });

    it('should cancel an order', async () => {
      const orderId = 'test-order-id';
      const response = await axios.post(
        `${API_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('cancelled');
    });
  });

  describe('Risk Management', () => {
    it('should check position limits', async () => {
      const response = await axios.get(
        `${API_URL}/risk/limits`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('maxPositionSize');
      expect(response.data).toHaveProperty('maxLeverage');
      expect(response.data).toHaveProperty('maxDrawdown');
    });

    it('should validate risk parameters', async () => {
      const riskParams = {
        maxPositionSize: 100000,
        maxLeverage: 10,
        maxDrawdown: 0.2
      };

      const response = await axios.post(
        `${API_URL}/risk/validate`,
        riskParams,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.isValid).toBeDefined();
      if (!response.data.isValid) {
        expect(response.data.reasons).toBeDefined();
      }
    });
  });

  describe('Performance Monitoring', () => {
    it('should track strategy metrics', async () => {
      const response = await axios.get(
        `${API_URL}/monitoring/metrics`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalStrategies');
      expect(response.data).toHaveProperty('activeStrategies');
      expect(response.data).toHaveProperty('totalOrders');
      expect(response.data).toHaveProperty('successRate');
    });

    it('should get real-time performance updates', async () => {
      const response = await axios.get(
        `${API_URL}/monitoring/performance`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('strategies');
      expect(Array.isArray(response.data.strategies)).toBe(true);
    });
  });
}); 