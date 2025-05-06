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
exports.BinanceClient = void 0;
const BaseExchangeClient_1 = require("./BaseExchangeClient");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../../utils/logger");
class BinanceClient extends BaseExchangeClient_1.BaseExchangeClient {
    constructor(credentials, isTestnet = false) {
        super('binance', credentials);
        this.baseUrl = isTestnet ? 'https://testnet.binance.vision' : 'https://api.binance.com';
    }
    request(method, endpoint, params = {}, isPrivate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}${endpoint}`;
            const timestamp = Date.now();
            if (isPrivate) {
                params.timestamp = timestamp;
                const queryString = new URLSearchParams(params).toString();
                const signature = crypto_1.default
                    .createHmac('sha256', this.credentials.apiSecret)
                    .update(queryString)
                    .digest('hex');
                params.signature = signature;
            }
            const headers = {
                'Content-Type': 'application/json',
            };
            if (isPrivate) {
                headers['X-MBX-APIKEY'] = this.credentials.apiKey;
            }
            const response = yield (0, axios_1.default)({
                method,
                url,
                params,
                headers,
            });
            return response.data;
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.request('GET', '/api/v3/account', {}, true);
            return data.balances.map((balance) => ({
                currency: balance.asset,
                available: parseFloat(balance.free),
                frozen: parseFloat(balance.locked),
                total: parseFloat(balance.free) + parseFloat(balance.locked),
            }));
        });
    }
    getOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.request('GET', '/api/v3/order', { orderId }, true);
            return this.parseOrder(data);
        });
    }
    getOrders(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (symbol)
                params.symbol = symbol;
            const data = yield this.request('GET', '/api/v3/openOrders', params, true);
            return data.map(this.parseOrder);
        });
    }
    createOrder(symbol, type, side, amount, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                symbol,
                side: side.toUpperCase(),
                type: type.toUpperCase(),
                quantity: amount,
            };
            if (type === 'limit') {
                params.price = price;
                params.timeInForce = 'GTC';
            }
            const data = yield this.request('POST', '/api/v3/order', params, true);
            return this.parseOrder(data);
        });
    }
    cancelOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request('DELETE', '/api/v3/order', { orderId }, true);
        });
    }
    cancelOrders(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!symbol)
                throw new Error('Symbol is required for canceling all orders');
            yield this.request('DELETE', '/api/v3/openOrders', { symbol }, true);
        });
    }
    getPositions(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.request('GET', '/fapi/v2/positionRisk', {}, true);
            let positions = data.map(this.parsePosition);
            if (symbol) {
                positions = positions.filter((p) => p.symbol === symbol);
            }
            return positions;
        });
    }
    getTrades(symbol, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (symbol)
                params.symbol = symbol;
            if (startTime)
                params.startTime = startTime.getTime();
            if (endTime)
                params.endTime = endTime.getTime();
            const data = yield this.request('GET', '/api/v3/myTrades', params, true);
            return data.map(this.parseTrade);
        });
    }
    getMarketData(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.request('GET', '/api/v3/ticker/24hr', { symbol });
            return this.parseMarketData(data);
        });
    }
    getMarketDataList(symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.request('GET', '/api/v3/ticker/24hr');
            return data
                .filter((item) => symbols.includes(item.symbol))
                .map(this.parseMarketData);
        });
    }
    getKlines(symbol, interval, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { symbol, interval };
            if (startTime)
                params.startTime = startTime.getTime();
            if (endTime)
                params.endTime = endTime.getTime();
            return yield this.request('GET', '/api/v3/klines', params);
        });
    }
    getSymbols() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.request('GET', '/api/v3/exchangeInfo');
            return data.symbols.map((s) => s.symbol);
        });
    }
    getLeverage(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.request('GET', '/fapi/v2/leverageBracket', { symbol }, true);
            return data[0].brackets[0].initialLeverage;
        });
    }
    setLeverage(symbol, leverage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request('POST', '/fapi/v1/leverage', { symbol, leverage }, true);
        });
    }
    getFeeRate(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request('GET', '/api/v3/account', {}, true);
            const feeData = yield this.request('GET', '/api/v3/asset/tradeFee', { symbol }, true);
            return parseFloat(feeData[0].takerCommission);
        });
    }
    getAccountInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.request('GET', '/api/v3/account', {}, true);
                return response.data;
            }
            catch (error) {
                logger_1.logger.error('Error getting account info:', error);
                throw error;
            }
        });
    }
    parseOrder(data) {
        return {
            id: data.orderId.toString(),
            symbol: data.symbol,
            type: data.type.toLowerCase(),
            side: data.side.toLowerCase(),
            price: parseFloat(data.price),
            amount: parseFloat(data.origQty),
            status: data.status.toLowerCase(),
            filled: parseFloat(data.executedQty),
            remaining: parseFloat(data.origQty) - parseFloat(data.executedQty),
            cost: parseFloat(data.cummulativeQuoteQty),
            timestamp: new Date(data.time),
            createdAt: new Date(data.time),
            updatedAt: new Date(data.updateTime || data.time)
        };
    }
    parsePosition(data) {
        return {
            symbol: data.symbol,
            size: Math.abs(parseFloat(data.positionAmt)),
            side: parseFloat(data.positionAmt) > 0 ? 'long' : 'short',
            entryPrice: parseFloat(data.entryPrice),
            markPrice: parseFloat(data.markPrice),
            unrealizedPnl: parseFloat(data.unRealizedProfit),
            liquidationPrice: parseFloat(data.liquidationPrice),
            leverage: parseFloat(data.leverage),
            marginType: data.marginType.toLowerCase(),
            timestamp: new Date(),
            amount: parseFloat(data.positionAmt),
            margin: parseFloat(data.marginBalance),
            realizedPnl: parseFloat(data.realizedProfit || 0)
        };
    }
    parseTrade(data) {
        return {
            id: data.id.toString(),
            symbol: data.symbol,
            orderId: data.orderId.toString(),
            price: parseFloat(data.price),
            amount: parseFloat(data.qty),
            cost: parseFloat(data.quoteQty),
            fee: {
                cost: parseFloat(data.commission),
                currency: data.commissionAsset
            },
            side: data.isBuyer ? 'buy' : 'sell',
            timestamp: new Date(data.time),
            feeCurrency: data.commissionAsset
        };
    }
    parseMarketData(data) {
        return {
            symbol: data.symbol,
            timestamp: new Date(data.closeTime),
            open: parseFloat(data.openPrice),
            high: parseFloat(data.highPrice),
            low: parseFloat(data.lowPrice),
            close: parseFloat(data.lastPrice),
            volume: parseFloat(data.volume),
            quoteVolume: parseFloat(data.quoteVolume),
            trades: data.count,
            bid: parseFloat(data.bidPrice),
            ask: parseFloat(data.askPrice),
            last: parseFloat(data.lastPrice)
        };
    }
}
exports.BinanceClient = BinanceClient;
//# sourceMappingURL=BinanceClient.js.map