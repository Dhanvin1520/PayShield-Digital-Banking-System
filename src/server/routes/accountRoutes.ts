import { Router } from 'express';
import accountController from '../controllers/AccountController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', accountController.createAccount);
router.get('/', accountController.getAccounts);
router.get('/balance/total', accountController.getTotalBalance);
router.get('/beneficiaries', accountController.getBeneficiaries);
router.get('/all', adminMiddleware, accountController.getAllAccounts);
router.get('/:id', accountController.getAccountById);

export default router;
