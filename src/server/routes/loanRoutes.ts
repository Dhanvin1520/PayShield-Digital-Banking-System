import { Router } from 'express';
import loanController from '../controllers/LoanController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/apply', loanController.apply);
router.get('/', loanController.getLoans);
router.get('/all', adminMiddleware, loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.patch('/:id/status', adminMiddleware, loanController.updateStatus);

export default router;
