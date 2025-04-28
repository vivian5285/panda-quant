"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assetController_1 = require("../controllers/assetController");
const router = express_1.default.Router();
// 获取资产概览
router.get('/summary/:userId', assetController_1.getAssetSummary);
// 获取充值记录
router.get('/deposits/:userId', assetController_1.getDepositHistory);
// 获取托管费记录
router.get('/fees/:userId', assetController_1.getFeeHistory);
// 确认充值
router.post('/deposits/:userId/confirm', assetController_1.confirmDeposit);
exports.default = router;
