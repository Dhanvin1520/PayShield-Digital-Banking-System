import { Router } from 'express';
import transactionController from '../controllers/TransactionController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// All transaction routes are protected
router.use(authMiddleware);

router.post('/transfer', transactionController.transfer);
router.get('/', transactionController.getTransactions);
router.get('/flagged', adminMiddleware, transactionController.getFlaggedTransactions);
router.get('/account/:accountId', transactionController.getAccountTransactions);

export default router;
