"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const database_1 = require("../services/database");
const redis_1 = require("../services/redis");
const server_1 = require("../services/server");
const healthCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [database, redis, server] = yield Promise.all([
            (0, database_1.checkDatabaseHealth)(),
            (0, redis_1.checkRedisHealth)(),
            (0, server_1.checkServerHealth)(),
        ]);
        const response = {
            status: database && redis && server ? 'ok' : 'error',
            services: {
                database,
                redis,
                server,
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            services: {
                database: false,
                redis: false,
                server: false,
            },
        });
    }
});
exports.healthCheck = healthCheck;
