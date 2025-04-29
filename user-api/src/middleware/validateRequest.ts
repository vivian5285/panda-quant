import { Request, Response, NextFunction } from 'express';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateRequest = (type: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const object = plainToClass(type, req.body);
        const errors = await validate(object);

        if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => 
                Object.values(error.constraints || {})
            ).join(', ');
            return res.status(400).json({ error: message });
        }

        return next();
    };
}; 