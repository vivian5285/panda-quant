"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const dbLogger = (0, logger_1.createLogger)('Database');
async function connectDB() {
    try {
        await mongoose_1.default.connect(process.env['MONGODB_URI'] || 'mongodb://localhost:27017/panda-quant');
        dbLogger.info('Successfully connected to MongoDB.');
    }
    catch (error) {
        dbLogger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
async function disconnectDB() {
    try {
        await mongoose_1.default.disconnect();
        dbLogger.info('Successfully disconnected from MongoDB.');
    }
    catch (error) {
        dbLogger.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
}
mongoose_1.default.connection.on('error', (error) => {
    dbLogger.error('MongoDB connection error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    dbLogger.warn('MongoDB disconnected');
});
//# sourceMappingURL=database.js.map