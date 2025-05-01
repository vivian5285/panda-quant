"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const router = (0, express_1.Router)();
const transactionController = new transaction_controller_1.TransactionController();
router.post('/', transactionController.createTransaction.bind(transactionController));
router.get('/', transactionController.getTransactions.bind(transactionController));
router.get('/:id', transactionController.getTransactionById.bind(transactionController));
router.put('/:id', transactionController.updateTransaction.bind(transactionController));
router.delete('/:id', transactionController.deleteTransaction.bind(transactionController));
exports.default = router;
//# sourceMappingURL=transaction.js.map