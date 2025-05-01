"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpectedMonthlyReturn = getExpectedMonthlyReturn;
const web3_1 = __importDefault(require("web3"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const strategy_1 = require("./strategy");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Initialize Web3
const web3 = new web3_1.default(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
const account = process.env.ACCOUNT || '0x0000000000000000000000000000000000000000';
// Initialize Strategy Runner
const strategyRunner = new strategy_1.StrategyRunner(web3, account);
// Middleware
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Start server
app.listen(port, () => {
    console.log(`Strategy Engine running on port ${port}`);
});
function getExpectedMonthlyReturn(name, riskLevel) {
    // TODO: Implement expected return calculation
    const baseReturns = {
        high: 15,
        medium: 8,
        low: 3
    };
    return baseReturns[riskLevel] || 0;
}
