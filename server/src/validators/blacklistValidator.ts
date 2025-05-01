import { IBlacklistEntry, BlacklistType, BlacklistStatus } from '../types/blacklist';
import { body } from 'express-validator';

export const blacklistValidator = [
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('reason').isString().notEmpty().withMessage('Reason is required'),
  body('type').isIn(Object.values(BlacklistType)).withMessage('Invalid type'),
  body('status').isIn(Object.values(BlacklistStatus)).withMessage('Invalid status'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid date format')
];

export const validateBlacklistEntry = (entryData: Partial<IBlacklistEntry>): string[] => {
  const errors: string[] = [];

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