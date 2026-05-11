import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import {
  register, verifyOtp, login, forgotPassword, resetPassword, me, validateRegister,
} from '../controllers/auth.controller.js';

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60_000, max: 50 });

router.use(limiter);
router.post('/register', validateRegister, register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', requireAuth, me);

export default router;
