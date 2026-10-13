import express from 'express';
import { registerUser, loginUser, getMe, updateProfile, logoutUser, uploadAvatar } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);

export default router;
