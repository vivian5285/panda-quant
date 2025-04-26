import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ValidationError } from './error';

export const validateRequest = (rules: any[]) => {
  return [
    ...rules,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
      }
      next();
    }
  ];
};

// 常用的验证规则
export const commonValidators = {
  email: body('email').isEmail().withMessage('Invalid email format'),
  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  requiredString: (field: string) => 
    body(field).notEmpty().withMessage(`${field} is required`),
  optionalString: (field: string) => 
    body(field).optional().isString().withMessage(`${field} must be a string`)
}; 