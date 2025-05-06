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
const express_1 = require("express");
const Auth_1 = require("../middleware/Auth");
const settlement_controller_1 = require("../controllers/settlement.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const settlementController = new settlement_controller_1.SettlementController();
// Admin routes
router.get('/admin/settlements', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/admin/settlements', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.createSettlement(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/admin/settlements/:id/status', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/admin/settlements/:id', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/admin/settlements/export', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.exportSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/admin/settlements/generate', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.generateSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/admin/settlements/:id/process', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
// User routes
router.get('/', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.createSettlement(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id/status', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.processPayment(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/export', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.exportSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/generate', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.generateSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/:id/process', auth_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settlementController.processPayment(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
//# sourceMappingURL=settlement.routes.js.map