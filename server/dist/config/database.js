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
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const dbLogger = (0, logger_1.createLogger)('Database');
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env['MONGODB_URI'] || 'mongodb://localhost:27017/panda-quant');
            dbLogger.info('Successfully connected to MongoDB.');
        }
        catch (error) {
            dbLogger.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    });
}
exports.connectDB = connectDB;
function disconnectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.disconnect();
            dbLogger.info('Successfully disconnected from MongoDB.');
        }
        catch (error) {
            dbLogger.error('Error disconnecting from MongoDB:', error);
            process.exit(1);
        }
    });
}
exports.disconnectDB = disconnectDB;
mongoose_1.default.connection.on('error', (error) => {
    dbLogger.error('MongoDB connection error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    dbLogger.warn('MongoDB disconnected');
});
//# sourceMappingURL=database.js.map