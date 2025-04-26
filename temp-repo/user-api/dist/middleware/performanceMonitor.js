"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceMonitor = void 0;
const performanceMonitor = (req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000;
        console.log(`${req.method} ${req.url} took ${duration.toFixed(2)}ms`);
    });
    next();
};
exports.performanceMonitor = performanceMonitor;
