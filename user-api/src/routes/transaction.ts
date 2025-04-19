import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();
const transactionController = new TransactionController();

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router; 