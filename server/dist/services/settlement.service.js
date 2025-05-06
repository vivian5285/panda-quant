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
exports.SettlementService = void 0;
const mongoose_1 = require("mongoose");
const Settlement_1 = __importDefault(require("../models/Settlement"));
const logger_1 = require("../utils/logger");
const Settlement_2 = require("../types/Settlement");
class SettlementService {
    constructor() { }
    static getInstance() {
        if (!SettlementService.instance) {
            SettlementService.instance = new SettlementService();
        }
        return SettlementService.instance;
    }
    createSettlement(userId, amount, type, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = new Settlement_1.default({
                    userId: new mongoose_1.Types.ObjectId(userId),
                    amount,
                    type,
                    status: Settlement_2.SettlementStatus.PENDING,
                    metadata
                });
                const savedSettlement = yield settlement.save();
                return savedSettlement;
            }
            catch (error) {
                logger_1.logger.error('Error creating settlement:', error);
                throw error;
            }
        });
    }
    updateSettlementStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = yield Settlement_1.default.findByIdAndUpdate(id, { $set: { status } }, { new: true });
                return settlement;
            }
            catch (error) {
                logger_1.logger.error('Error updating settlement status:', error);
                throw error;
            }
        });
    }
    getSettlementById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = yield Settlement_1.default.findById(id);
                return settlement;
            }
            catch (error) {
                logger_1.logger.error('Error getting settlement by id:', error);
                throw error;
            }
        });
    }
}
exports.SettlementService = SettlementService;
//# sourceMappingURL=settlement.service.js.map