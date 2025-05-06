import { body } from 'express-validator';
export const userLevelValidator = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('level').isNumeric().withMessage('Level must be a number'),
    body('experience').isNumeric().withMessage('Experience must be a number'),
    body('requiredExperience').isNumeric().withMessage('Required experience must be a number'),
    body('minCommission').isNumeric().withMessage('Min commission must be a number'),
    body('maxCommission').isNumeric().withMessage('Max commission must be a number'),
    body('benefits.commissionRate').isNumeric().withMessage('Commission rate must be a number'),
    body('benefits.withdrawalLimit').isNumeric().withMessage('Withdrawal limit must be a number'),
    body('benefits.strategyLimit').isNumeric().withMessage('Strategy limit must be a number'),
    body('requirements').isObject().withMessage('Requirements must be an object'),
    body('requirements.minBalance').optional().isNumeric().withMessage('Min balance must be a number'),
    body('requirements.minTradingVolume').optional().isNumeric().withMessage('Min trading volume must be a number'),
    body('requirements.minHoldingTime').optional().isNumeric().withMessage('Min holding time must be a number')
];
export function validateUserLevel(levelData) {
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