"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = exports.updateStrategyStatus = exports.getStrategyDetails = exports.getAllStrategies = void 0;
const axios_1 = __importDefault(require("axios"));
const serverClient = axios_1.default.create({
    baseURL: process.env.SERVER_URL,
    timeout: 5000
});
const getAllStrategies = async () => {
    try {
        const response = await serverClient.get('/strategies');
        return response.data;
    }
    catch (error) {
        console.error('Error getting all strategies:', error);
        throw error;
    }
};
exports.getAllStrategies = getAllStrategies;
const getStrategyDetails = async (executionId) => {
    try {
        const response = await serverClient.get(`/strategies/${executionId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting strategy details:', error);
        throw error;
    }
};
exports.getStrategyDetails = getStrategyDetails;
const updateStrategyStatus = async (executionId, status, result) => {
    try {
        await serverClient.post('/strategies/status', {
            executionId,
            status,
            result
        });
    }
    catch (error) {
        console.error('Error updating strategy status:', error);
        throw error;
    }
};
exports.updateStrategyStatus = updateStrategyStatus;
class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async createStrategy(strategy) {
        // Implementation
    }
}
exports.StrategyService = StrategyService;
