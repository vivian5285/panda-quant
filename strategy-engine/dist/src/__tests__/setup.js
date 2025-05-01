"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// 加载测试环境变量
(0, dotenv_1.config)({ path: '.env.test' });
// 配置测试环境
process.env.NODE_ENV = 'test';
// 模拟日志
jest.mock('../utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    },
}));
// 全局测试超时
jest.setTimeout(30000);
// 测试前清理
beforeEach(() => {
    jest.clearAllMocks();
});
// 测试后清理
afterEach(() => {
    jest.clearAllMocks();
});
// 全局测试后清理
afterAll(() => {
    jest.restoreAllMocks();
});
