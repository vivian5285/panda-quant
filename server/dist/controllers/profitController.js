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
exports.ProfitController = void 0;
const logger_1 = require("../utils/logger");
const CommissionService_1 = require("../services/CommissionService");
const ProfitService_1 = require("../services/ProfitService");
class ProfitController {
    constructor() {
        this.getProfitSummary = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const summary = yield this.profitService.getProfitSummary();
                res.json(summary);
            }
            catch (error) {
                logger_1.logger.error('Error getting profit summary:', error);
                res.status(500).json({ message: 'Error getting profit summary', error: error.message });
            }
        });
        this.updateCommission = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updates = req.body;
                const commission = yield this.commissionService.updateCommission(id.toString(), updates);
                res.status(200).json(commission);
            }
            catch (error) {
                logger_1.logger.error('Error updating commission:', error);
                res.status(500).json({ message: 'Error updating commission', error });
            }
        });
        this.deleteCommission = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.commissionService.deleteCommission(id.toString());
                res.status(204).send();
            }
            catch (error) {
                logger_1.logger.error('Error deleting commission:', error);
                res.status(500).json({ message: 'Error deleting commission', error });
            }
        });
        this.commissionService = CommissionService_1.CommissionService.getInstance();
        this.profitService = ProfitService_1.ProfitService.getInstance();
    }
}
exports.ProfitController = ProfitController;
exports.default = new ProfitController();
//# sourceMappingURL=profitController.js.map