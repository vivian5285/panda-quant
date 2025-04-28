"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const assetRoutes_1 = __importDefault(require("./assetRoutes"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/users', user_1.default);
router.use('/assets', assetRoutes_1.default);
exports.default = router;
