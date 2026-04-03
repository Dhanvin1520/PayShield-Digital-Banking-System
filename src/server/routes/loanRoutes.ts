import { Router } from 'express';
import loanController from '../controllers/LoanController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// All loan routes are protected
router.use(authMiddleware);

router.post('/apply', loanController.apply);
router.get('/', loanController.getLoans);
router.get('/:id', loanController.getLoanById);
router.patch('/:id/status', adminMiddleware, loanController.updateStatus);

export default router;
