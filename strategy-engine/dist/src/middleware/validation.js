"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStrategyExecution = void 0;
const validateStrategyExecution = (req, res, next) => {
    const { strategyId, userId, parameters } = req.body;
    if (!strategyId || !userId) {
        return res.status(400).json({ error: '缺少必要的参数' });
    }
    if (typeof parameters !== 'object') {
        return res.status(400).json({ error: '参数格式不正确' });
    }
    next();
};
exports.validateStrategyExecution = validateStrategyExecution;
