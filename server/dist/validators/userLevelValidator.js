"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLevelValidator = void 0;
exports.validateUserLevel = validateUserLevel;
const express_validator_1 = require("express-validator");
exports.userLevelValidator = [
    (0, express_validator_1.body)('name').isString().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('level').isNumeric().withMessage('Level must be a number'),
    (0, express_validator_1.body)('experience').isNumeric().withMessage('Experience must be a number'),
    (0, express_validator_1.body)('requiredExperience').isNumeric().withMessage('Required experience must be a number'),
    (0, express_validator_1.body)('minCommission').isNumeric().withMessage('Min commission must be a number'),
    (0, express_validator_1.body)('maxCommission').isNumeric().withMessage('Max commission must be a number'),
    (0, express_validator_1.body)('benefits.commissionRate').isNumeric().withMessage('Commission rate must be a number'),
    (0, express_validator_1.body)('benefits.withdrawalLimit').isNumeric().withMessage('Withdrawal limit must be a number'),
    (0, express_validator_1.body)('benefits.strategyLimit').isNumeric().withMessage('Strategy limit must be a number'),
    (0, express_validator_1.body)('requirements').isObject().withMessage('Requirements must be an object'),
    (0, express_validator_1.body)('requirements.minBalance').optional().isNumeric().withMessage('Min balance must be a number'),
    (0, express_validator_1.body)('requirements.minTradingVolume').optional().isNumeric().withMessage('Min trading volume must be a number'),
    (0, express_validator_1.body)('requirements.minHoldingTime').optional().isNumeric().withMessage('Min holding time must be a number')
];
function validateUserLevel(levelData) {
    if (!levelData.name || typeof levelData.name !== 'string') {
        throw new Error('Invalid name');
    }
    if (typeof levelData.level !== 'number') {
        throw new Error('Invalid level');
    }
    if (typeof levelData.experience !== 'number') {
        throw new Error('Invalid experience');
    }
    if (typeof levelData.requiredExperience !== 'number') {
        throw new Error('Invalid required experience');
    }
    if (typeof levelData.minCommission !== 'number') {
        throw new Error('Invalid minimum commission');
    }
    if (typeof levelData.maxCommission !== 'number') {
        throw new Error('Invalid maximum commission');
    }
    if (levelData.achievements && !Array.isArray(levelData.achievements)) {
        throw new Error('Invalid achievements');
    }
    if (levelData.metadata && typeof levelData.metadata !== 'object') {
        throw new Error('Invalid metadata');
    }
}
//# sourceMappingURL=userLevelValidator.js.map