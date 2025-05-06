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
const StrategyController_1 = require("../controllers/StrategyController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// 所有路由都需要认证
router.use(auth_middleware_1.authenticateToken);
// 获取策略列表
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StrategyController_1.strategyController.getAllStrategies(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// 创建策略
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StrategyController_1.strategyController.createStrategy(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// 获取单个策略
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StrategyController_1.strategyController.getStrategyById(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// 更新策略
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StrategyController_1.strategyController.updateStrategy(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// 删除策略
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StrategyController_1.strategyController.deleteStrategy(req, res);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
//# sourceMappingURL=Strategy.js.map