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
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
exports.checkDatabaseHealth = checkDatabaseHealth;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant';
        yield mongoose_1.default.connect(mongoUri);
        console.log('Connected to MongoDB');
    });
}
function disconnectDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    });
}
function checkDatabaseHealth() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connection.db.admin().ping();
            return true;
        }
        catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    });
}
