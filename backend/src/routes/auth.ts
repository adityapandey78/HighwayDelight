import { Router } from 'express';
import { signup, signin, getMe, sendOTP, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/send-otp', sendOTP);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);

export default router;