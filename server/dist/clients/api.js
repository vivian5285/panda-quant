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
exports.updateStrategyStatus = exports.getUserInfo = exports.executeStrategy = exports.strategyEngineApi = exports.adminApi = exports.userApi = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
// User API client
exports.userApi = axios_1.default.create({
    baseURL: process.env['USER_API_URL'],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Admin API client
exports.adminApi = axios_1.default.create({
    baseURL: process.env['ADMIN_API_URL'],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Strategy Engine API client
exports.strategyEngineApi = axios_1.default.create({
    baseURL: process.env['STRATEGY_ENGINE_URL'],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
const executeStrategy = (request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield exports.strategyEngineApi.post('/strategies/execute', request);
        return response.data;
    }
    catch (error) {
        logger_1.logger.error('Error executing strategy:', error);
        throw error;
    }
});
exports.executeStrategy = executeStrategy;
const getUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield exports.userApi.get(`/users/${userId}`);
        return response.data;
    }
    catch (error) {
        logger_1.logger.error('Error getting user info:', error);
        throw error;
    }
});
exports.getUserInfo = getUserInfo;
const updateStrategyStatus = (executionId, status, result) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.adminApi.post('/strategies/status', {
            executionId,
            status,
            result,
        });
    }
    catch (error) {
        logger_1.logger.error('Error updating strategy status:', error);
        throw error;
    }
});
exports.updateStrategyStatus = updateStrategyStatus;
//# sourceMappingURL=api.js.map