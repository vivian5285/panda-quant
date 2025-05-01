"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionController = void 0;
const CommissionService_1 = require("../services/CommissionService");
const errorHandler_1 = require("../utils/errorHandler");
const AppError_1 = require("../utils/AppError");
const enums_1 = require("../types/enums");
class CommissionController {
    constructor() {
        this.commissionService = CommissionService_1.CommissionService.getInstance();
    }
    static getInstance() {
        if (!CommissionController.instance) {
            CommissionController.instance = new CommissionController();
        }
        return CommissionController.instance;
    }
    checkAuth(req) {
        var _a;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            throw new AppError_1.AppError('Unauthorized', 401);
        }
    }
    async createCommission(req, res) {
        try {
            this.checkAuth(req);
            const commission = await this.commissionService.createCommission({
                userId: req.user._id,
                amount: req.body.amount,
                type: req.body.type,
                status: enums_1.CommissionStatus.PENDING
            });
            res.status(201).json(commission);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async getCommissions(req, res) {
        try {
            this.checkAuth(req);
            const commissions = await this.commissionService.getCommissionStats(req.user._id.toString());
            res.json(commissions);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async getCommission(req, res) {
        try {
            this.checkAuth(req);
            const commission = await this.commissionService.getCommissionById(req.params['id']);
            if (!commission) {
                throw new AppError_1.AppError('Commission not found', 404);
            }
            res.json(commission);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async updateCommission(req, res) {
        try {
            this.checkAuth(req);
            const commission = await this.commissionService.updateCommission(req.params['id'], req.body);
            if (!commission) {
                throw new AppError_1.AppError('Commission not found', 404);
            }
            res.json(commission);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async deleteCommission(req, res) {
        try {
            this.checkAuth(req);
            await this.commissionService.deleteCommission(req.params['id']);
            res.status(204).send();
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
}
exports.CommissionController = CommissionController;
//# sourceMappingURL=commission.js.map