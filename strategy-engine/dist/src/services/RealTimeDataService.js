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
exports.RealTimeDataService = void 0;
const ws_1 = __importDefault(require("ws"));
const ioredis_1 = require("ioredis");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
class RealTimeDataService {
    constructor() {
        this.ws = null;
        this.subscribers = new Map();
        this.reconnectAttempts = 0;
        this.MAX_RECONNECT_ATTEMPTS = 5;
        this.RECONNECT_DELAY = 5000;
        this.CACHE_TTL = 60; // 1 minute cache TTL
        this.redis = new ioredis_1.Redis(config_1.config.redis);
        this.connect();
    }
    static getInstance() {
        if (!RealTimeDataService.instance) {
            RealTimeDataService.instance = new RealTimeDataService();
        }
        return RealTimeDataService.instance;
    }
    connect() {
        try {
            this.ws = new ws_1.default(config_1.config.wsUrl);
            this.setupWebSocketHandlers();
        }
        catch (error) {
            logger_1.logger.error('WebSocket connection failed:', error);
            this.handleReconnect();
        }
    }
    setupWebSocketHandlers() {
        if (!this.ws)
            return;
        this.ws.on('open', () => {
            logger_1.logger.info('WebSocket connected');
            this.reconnectAttempts = 0;
            this.subscribeToSymbols();
        });
        this.ws.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const marketData = JSON.parse(data);
                yield this.processMarketData(marketData);
            }
            catch (error) {
                logger_1.logger.error('Error processing market data:', error);
            }
        }));
        this.ws.on('close', () => {
            logger_1.logger.warn('WebSocket connection closed');
            this.handleReconnect();
        });
        this.ws.on('error', (error) => {
            logger_1.logger.error('WebSocket error:', error);
            this.handleReconnect();
        });
    }
    processMarketData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cache the data
            yield this.redis.setex(`market:${data.symbol}`, this.CACHE_TTL, JSON.stringify(data));
            // Notify subscribers
            const symbolSubscribers = this.subscribers.get(data.symbol);
            if (symbolSubscribers) {
                symbolSubscribers.forEach(callback => {
                    try {
                        callback(data);
                    }
                    catch (error) {
                        logger_1.logger.error('Error in subscriber callback:', error);
                    }
                });
            }
        });
    }
    handleReconnect() {
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            logger_1.logger.error('Max reconnection attempts reached');
            return;
        }
        this.reconnectAttempts++;
        const delay = this.RECONNECT_DELAY * this.reconnectAttempts;
        logger_1.logger.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(), delay);
    }
    subscribeToSymbols() {
        if (!this.ws)
            return;
        const symbols = Array.from(this.subscribers.keys());
        if (symbols.length > 0) {
            this.ws.send(JSON.stringify({
                type: 'subscribe',
                symbols
            }));
        }
    }
    getMarketData(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try to get from cache first
            const cachedData = yield this.redis.get(`market:${symbol}`);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            // If not in cache, fetch from WebSocket
            return new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(null), 5000);
                const callback = (data) => {
                    clearTimeout(timeout);
                    resolve(data);
                    this.unsubscribe(symbol, callback);
                };
                this.subscribe(symbol, callback);
            });
        });
    }
    subscribe(symbol, callback) {
        var _a, _b;
        if (!this.subscribers.has(symbol)) {
            this.subscribers.set(symbol, new Set());
        }
        (_a = this.subscribers.get(symbol)) === null || _a === void 0 ? void 0 : _a.add(callback);
        if (((_b = this.ws) === null || _b === void 0 ? void 0 : _b.readyState) === ws_1.default.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'subscribe',
                symbols: [symbol]
            }));
        }
    }
    unsubscribe(symbol, callback) {
        var _a;
        const symbolSubscribers = this.subscribers.get(symbol);
        if (symbolSubscribers) {
            symbolSubscribers.delete(callback);
            if (symbolSubscribers.size === 0) {
                this.subscribers.delete(symbol);
                if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.OPEN) {
                    this.ws.send(JSON.stringify({
                        type: 'unsubscribe',
                        symbols: [symbol]
                    }));
                }
            }
        }
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ws) {
                this.ws.close();
            }
            yield this.redis.quit();
        });
    }
}
exports.RealTimeDataService = RealTimeDataService;
