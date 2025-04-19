import { Request, Response, NextFunction } from 'express';

export const performanceMonitor = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000;
        console.log(`${req.method} ${req.url} took ${duration.toFixed(2)}ms`);
    });

    next();
}; 