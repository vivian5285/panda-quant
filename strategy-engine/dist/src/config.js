"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
    },
    server: {
        port: parseInt(process.env.PORT || '4000')
    },
    wsUrl: process.env.WS_URL || 'ws://localhost:4000'
};
