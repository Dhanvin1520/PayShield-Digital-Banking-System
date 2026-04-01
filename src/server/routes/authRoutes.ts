import { Router } from 'express';
import authController from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', authMiddleware, authController.getProfile);

export default router;
