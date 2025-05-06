import axios from 'axios';
import { logger } from '../utils/logger';
// User API client
export const userApi = axios.create({
    baseURL: process.env['USER_API_URL'],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Admin API client
export const adminApi = axios.create({
    baseURL: process.env['ADMIN_API_URL'],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Strategy Engine API client
export const strategyEngineApi = axios.create({
    baseURL: process.env['STRATEGY_ENGINE_URL'],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const executeStrategy = async (request) => {
    try {
        const response = await strategyEngineApi.post('/strategies/execute', request);
        return response.data;
    }
    catch (error) {
        logger.error('Error executing strategy:', error);
        throw error;
    }
};
export const getUserInfo = async (userId) => {
    try {
        const response = await userApi.get(`/users/${userId}`);
        return response.data;
    }
    catch (error) {
        logger.error('Error getting user info:', error);
        throw error;
    }
};
export const updateStrategyStatus = async (executionId, status, result) => {
    try {
        await adminApi.post('/strategies/status', {
            executionId,
            status,
            result,
        });
    }
    catch (error) {
        logger.error('Error updating strategy status:', error);
        throw error;
    }
};
//# sourceMappingURL=api.js.map