import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  createProviderByAdmin,
  updateProviderByAdmin,
  updateProviderStatus,
  approveProvider,
  getAllBookings,
  deleteOrBanUser,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.post('/providers', createProviderByAdmin);
router.put('/providers/:id', updateProviderByAdmin);
router.put('/users/:id/status', updateProviderStatus);
router.put('/users/:id/approve', approveProvider);
router.get('/bookings', getAllBookings);
router.delete('/users/:id', deleteOrBanUser);

export default router;
