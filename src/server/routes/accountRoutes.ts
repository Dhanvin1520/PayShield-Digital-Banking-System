import { Router } from 'express';
import accountController from '../controllers/AccountController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', accountController.createAccount);
router.get('/', accountController.getAccounts);
router.get('/balance/total', accountController.getTotalBalance);
router.get('/:id', accountController.getAccountById);

export default router;
