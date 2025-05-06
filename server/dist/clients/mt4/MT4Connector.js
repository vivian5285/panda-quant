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
exports.MT4Connector = void 0;
const net_1 = __importDefault(require("net"));
const events_1 = require("events");
const logger_1 = require("../../utils/logger");
class MT4Connector extends events_1.EventEmitter {
    constructor(account) {
        super();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 5000;
        this.logger = (0, logger_1.createLogger)('MT4Connector');
        this.account = account;
        this.socket = new net_1.default.Socket();
        this.setupSocket();
    }
    setupSocket() {
        this.socket.on('connect', () => {
            this.logger.info(`Connected to MT4 server ${this.account.server}`);
            this.reconnectAttempts = 0;
            this.emit('connected');
        });
        this.socket.on('data', (data) => {
            this.onData(data);
        });
        this.socket.on('error', (error) => {
            this.onError(error);
        });
        this.socket.on('close', () => {
            this.logger.info('MT4 connection closed');
            this.emit('disconnected');
            this.handleReconnect();
        });
    }
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), this.reconnectInterval);
        }
        else {
            this.logger.error('Max reconnection attempts reached');
            this.emit('error', new Error('Max reconnection attempts reached'));
        }
    }
    connect() {
        this.logger.info('Connecting to MT4...');
        return new Promise((resolve, reject) => {
            const [host, port] = this.account.server.split(':');
            this.socket.connect(parseInt(port), host, () => {
                // 发送登录信息
                this.sendLogin();
                resolve();
            });
            this.socket.once('error', reject);
        });
    }
    disconnect() {
        this.logger.info('Disconnecting from MT4...');
        this.socket.destroy();
    }
    sendLogin() {
        const loginData = {
            type: 'login',
            login: this.account.login,
            password: this.account.password,
        };
        this.socket.write(JSON.stringify(loginData) + '\n');
    }
    onData(data) {
        this.logger.debug('Received data from MT4:', data);
        try {
            const message = JSON.parse(data.toString());
            this.emit('message', message);
            switch (message.type) {
                case 'login_response':
                    this.handleLoginResponse(message);
                    break;
                case 'position':
                    this.handlePosition(message);
                    break;
                case 'order':
                    this.handleOrder(message);
                    break;
                case 'balance':
                    this.handleBalance(message);
                    break;
                case 'market_data':
                    this.handleMarketData(message);
                    break;
            }
        }
        catch (error) {
            this.logger.error('Error parsing MT4 message:', error);
        }
    }
    onError(error) {
        this.logger.error('MT4 connection error:', error);
        this.emit('error', error);
    }
    handleLoginResponse(response) {
        if (response.success) {
            this.logger.info('Successfully logged in to MT4');
            this.emit('login_success');
        }
        else {
            this.logger.error('MT4 login failed:', response.error);
            this.emit('login_failed', response.error);
        }
    }
    handlePosition(data) {
        const position = {
            ticket: data.ticket,
            symbol: data.symbol,
            type: data.type,
            volume: data.lots,
            openPrice: data.openPrice,
            currentPrice: data.currentPrice,
            stopLoss: data.stopLoss,
            takeProfit: data.takeProfit,
            swap: data.swap,
            profit: data.profit,
            openTime: new Date(data.openTime),
            closeTime: data.closeTime ? new Date(data.closeTime) : undefined
        };
        this.emit('position', position);
        return position;
    }
    handleOrder(data) {
        const order = {
            ticket: data.ticket,
            symbol: data.symbol,
            type: data.type,
            volume: data.lots,
            price: data.price,
            stopLoss: data.stopLoss,
            takeProfit: data.takeProfit,
            openTime: new Date(data.openTime),
            closeTime: data.closeTime ? new Date(data.closeTime) : undefined,
            status: data.status
        };
        this.emit('order', order);
        return order;
    }
    handleBalance(data) {
        const balance = {
            balance: data.balance,
            equity: data.equity,
            margin: data.margin,
            freeMargin: data.freeMargin,
            marginLevel: data.marginLevel,
            timestamp: new Date()
        };
        this.emit('balance', balance);
        return balance;
    }
    handleMarketData(data) {
        const marketData = {
            symbol: data.symbol,
            bid: data.bid,
            ask: data.ask,
            high: data.high,
            low: data.low,
            time: new Date(data.time),
            volume: data.volume,
            spread: data.ask - data.bid
        };
        this.emit('market_data', marketData);
        return marketData;
    }
    // 公共方法
    getPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const positions = [];
                const handler = (position) => {
                    positions.push(position);
                };
                this.on('position', handler);
                this.socket.write(JSON.stringify({ type: 'get_positions' }) + '\n');
                setTimeout(() => {
                    this.removeListener('position', handler);
                    resolve(positions);
                }, 1000);
            });
        });
    }
    getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const orders = [];
                const handler = (order) => {
                    orders.push(order);
                };
                this.on('order', handler);
                this.socket.write(JSON.stringify({ type: 'get_orders' }) + '\n');
                setTimeout(() => {
                    this.removeListener('order', handler);
                    resolve(orders);
                }, 1000);
            });
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const handler = (balance) => {
                    this.removeListener('balance', handler);
                    resolve(balance);
                };
                this.on('balance', handler);
                this.socket.write(JSON.stringify({ type: 'get_balance' }) + '\n');
            });
        });
    }
    getMarketData(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const handler = (marketData) => {
                    if (marketData.symbol === symbol) {
                        this.removeListener('market_data', handler);
                        resolve(marketData);
                    }
                };
                this.on('market_data', handler);
                this.socket.write(JSON.stringify({ type: 'get_market_data', symbol }) + '\n');
            });
        });
    }
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const handler = (newOrder) => {
                    if (newOrder['symbol'] === order['symbol'] && newOrder['type'] === order['type']) {
                        this.removeListener('order', handler);
                        resolve(newOrder);
                    }
                };
                this.on('order', handler);
                this.socket.write(JSON.stringify(Object.assign({ messageType: 'create_order' }, order)) + '\n');
            });
        });
    }
    closePosition(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.write(JSON.stringify({ type: 'close_position', ticket }) + '\n');
        });
    }
    modifyOrder(ticket, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.write(JSON.stringify(Object.assign({ type: 'modify_order', ticket }, changes)) + '\n');
        });
    }
}
exports.MT4Connector = MT4Connector;
//# sourceMappingURL=MT4Connector.js.map