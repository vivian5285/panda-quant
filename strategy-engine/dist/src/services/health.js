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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkServerHealth = exports.checkRedisHealth = exports.checkDatabaseHealth = void 0;
exports.checkHealth = checkHealth;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("./redis");
const axios_1 = __importDefault(require("axios"));
const checkDatabaseHealth = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.connection.db) {
            return false;
        }
        yield mongoose_1.default.connection.db.admin().ping();
        return true;
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
});
exports.checkDatabaseHealth = checkDatabaseHealth;
const checkRedisHealth = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_1.redis.ping();
        return true;
    }
    catch (error) {
        console.error('Redis health check failed:', error);
        return false;
    }
});
exports.checkRedisHealth = checkRedisHealth;
const checkServerHealth = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${process.env.SERVER_URL}/health`);
        return response.data.status === 'ok';
    }
    catch (error) {
        console.error('Server health check failed:', error);
        return false;
    }
});
exports.checkServerHealth = checkServerHealth;
function checkHealth() {
    return __awaiter(this, void 0, void 0, function* () {
        const redisStatus = yield checkRedis();
        const databaseStatus = yield checkDatabase();
        const serverStatus = yield checkServer();
        return {
            status: redisStatus && databaseStatus && serverStatus ? 'healthy' : 'degraded',
            services: {
                redis: redisStatus,
                database: databaseStatus,
                server: serverStatus
            }
        };
    });
}
function checkRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redis_1.redis.ping();
            return true;
        }
        catch (error) {
            console.error('Redis health check failed:', error);
            return false;
        }
    });
}
function checkDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Implement database health check
        return true;
    });
}
function checkServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Implement server health check
        return true;
    });
}
