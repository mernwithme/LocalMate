import express from 'express';
import {
  createBooking,
  getMyBookings,
  acceptBooking,
  rejectBooking,
  startBooking,
  completeBooking,
  cancelBooking,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('customer'), createBooking)
  .get(getMyBookings);

router.get('/requests', authorize('provider'), getMyBookings);

router.put('/:id/accept', authorize('provider'), acceptBooking);
router.put('/:id/reject', authorize('provider'), rejectBooking);
router.put('/:id/start', authorize('provider'), startBooking);
router.put('/:id/complete', authorize('provider'), completeBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/status', updateBookingStatus);

export default router;
