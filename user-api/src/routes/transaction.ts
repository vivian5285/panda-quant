import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();
const transactionController = new TransactionController();

// 创建交易记录
router.post('/', transactionController.createTransaction.bind(transactionController));

// 获取交易记录列表
router.get('/', transactionController.getTransactions.bind(transactionController));

// 获取单个交易记录详情
router.get('/:id', transactionController.getTransactionById.bind(transactionController));

// 更新交易记录
router.put('/:id', transactionController.updateTransaction.bind(transactionController));

// 删除交易记录
router.delete('/:id', transactionController.deleteTransaction.bind(transactionController));

export default router; 