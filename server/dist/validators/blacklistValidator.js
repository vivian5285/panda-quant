"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlacklistEntry = exports.blacklistValidator = void 0;
const blacklist_1 = require("../types/blacklist");
const express_validator_1 = require("express-validator");
exports.blacklistValidator = [
    (0, express_validator_1.body)('address').isString().notEmpty().withMessage('Address is required'),
    (0, express_validator_1.body)('reason').isString().notEmpty().withMessage('Reason is required'),
    (0, express_validator_1.body)('type').isIn(Object.values(blacklist_1.BlacklistType)).withMessage('Invalid type'),
    (0, express_validator_1.body)('status').isIn(Object.values(blacklist_1.BlacklistStatus)).withMessage('Invalid status'),
    (0, express_validator_1.body)('expiresAt').optional().isISO8601().withMessage('Invalid date format')
];
const validateBlacklistEntry = (entryData) => {
    const errors = [];
    if (!entryData.address) {
        errors.push('Address is required');
    }
    if (!entryData.reason) {
        errors.push('Reason is required');
    }
    if (!entryData.type) {
        errors.push('Type is required');
    }
    if (!entryData.status) {
        errors.push('Status is required');
    }
    return errors;
};
exports.validateBlacklistEntry = validateBlacklistEntry;
//# sourceMappingURL=blacklistValidator.js.map