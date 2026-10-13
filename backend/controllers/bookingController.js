import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const createBooking = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customer accounts can request service bookings.',
      });
    }

    const { serviceId, bookingDate, date, timeSlot, time, address, notes, message } = req.body;
    const finalDate = (bookingDate || date || '').toString().trim();
    const finalTime = (timeSlot || time || '').toString().trim();
    const finalNotes = notes || message || '';

    if (!serviceId || !finalDate || !finalTime || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service, date, time, and service address.',
      });
    }

    const parsedDate = new Date(finalDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking date format. Please provide a valid date (YYYY-MM-DD).',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(parsedDate);
    checkDate.setHours(0, 0, 0, 0);
    if (checkDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be in the past.',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service listing not found' });
    }

    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own service listing.',
      });
    }

    const provider = await User.findById(service.provider);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Assigned provider not found' });
    }

    if (!provider.isApproved || (provider.verificationStatus && provider.verificationStatus !== 'APPROVED')) {
      return res.status(400).json({
        success: false,
        message: 'This provider is currently not approved or available to accept bookings.',
      });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      provider: service.provider,
      service: serviceId,
      bookingDate: finalDate,
      timeSlot: finalTime,
      address,
      notes: finalNotes,
      totalAmount: service.price,
      status: 'pending',
      paymentStatus: 'pending',
      paymentId: '',
    });

    await Notification.create({
      user: service.provider,
      title: 'New Booking Request',
      message: `New booking request from ${req.user.name} for "${service.title}".`,
      type: 'booking',
      link: '/dashboard/provider',
    });

    res.status(201).json({
      success: true,
      message: 'Booking request sent. Waiting for provider confirmation.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'provider') {
      query.provider = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email avatar phone address')
      .populate('provider', 'name email avatar phone rating address bio skills availabilityStatus isVerifiedProvider')
      .populate('service', 'title price images category duration location area')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title price');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.provider._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned provider can accept this booking request.',
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept booking with current status "${booking.status}". Must be "pending".`,
      });
    }

    booking.status = 'accepted';
    await booking.save();

    await Notification.create({
      user: booking.customer._id,
      title: 'Booking Accepted',
      message: `Your booking request was accepted by ${req.user.name}.`,
      type: 'booking',
      link: '/dashboard/customer',
    });

    res.json({
      success: true,
      message: 'Booking request accepted successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectBooking = async (req, res, next) => {
  try {
    const { reason, rejectionReason } = req.body;
    const finalReason = rejectionReason || reason || 'Not available at this time';

    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title price');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.provider._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned provider can reject this booking request.',
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject booking with current status "${booking.status}". Must be "pending".`,
      });
    }

    booking.status = 'rejected';
    booking.rejectionReason = finalReason;
    await booking.save();

    await Notification.create({
      user: booking.customer._id,
      title: 'Booking Declined',
      message: `Your booking request was declined by the provider. Reason: ${finalReason}`,
      type: 'booking',
      link: '/dashboard/customer',
    });

    res.json({
      success: true,
      message: 'Booking request rejected.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const startBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('service', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the assigned provider can start this service.' });
    }

    if (booking.status !== 'accepted' && booking.status !== 'on_the_way') {
      return res.status(400).json({
        success: false,
        message: `Cannot start service with current status "${booking.status}". Must be accepted or on the way.`,
      });
    }

    booking.status = 'started';
    await booking.save();

    await Notification.create({
      user: booking.customer._id,
      title: 'Service Started',
      message: `Your service for "${booking.service.title}" has started.`,
      type: 'booking',
      link: '/dashboard/customer',
    });

    res.json({ success: true, message: 'Service marked as started.', booking });
  } catch (error) {
    next(error);
  }
};

export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('service', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the assigned provider can complete this service.' });
    }

    if (booking.status !== 'started' && booking.status !== 'accepted' && booking.status !== 'on_the_way') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete service from current status "${booking.status}".`,
      });
    }

    booking.status = 'completed';
    booking.paymentStatus = 'paid';
    await booking.save();

    await User.findByIdAndUpdate(booking.provider, { $inc: { completedJobs: 1 } });

    await Notification.create({
      user: booking.customer._id,
      title: 'Service Completed',
      message: 'Your service has been marked as completed. Please leave a review!',
      type: 'booking',
      link: '/dashboard/customer',
    });

    res.json({ success: true, message: 'Service completed successfully.', booking });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isProvider = booking.provider._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Completed bookings cannot be cancelled.' });
    }
    if (booking.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Rejected bookings cannot be cancelled.' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    if (isCustomer) {
      await Notification.create({
        user: booking.provider._id,
        title: 'Booking Cancelled',
        message: `${req.user.name} cancelled the booking for "${booking.service.title}".`,
        type: 'booking',
        link: '/dashboard/provider',
      });
    } else {
      await Notification.create({
        user: booking.customer._id,
        title: 'Booking Cancelled',
        message: `Your booking for "${booking.service.title}" was cancelled.`,
        type: 'booking',
        link: '/dashboard/customer',
      });
    }

    res.json({ success: true, message: 'Booking cancelled successfully.', booking });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    let { status, rejectionReason } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }
    status = status.toLowerCase();

    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isProvider = booking.provider._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    if (isCustomer && !isAdmin && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'Customers can only cancel their booking requests.',
      });
    }

    const validTransitions = {
      pending: ['accepted', 'rejected', 'cancelled'],
      accepted: ['on_the_way', 'started', 'cancelled'],
      on_the_way: ['started', 'cancelled'],
      started: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      rejected: [],
    };

    if (!isAdmin && validTransitions[booking.status] && !validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change booking status from "${booking.status}" to "${status}".`,
      });
    }

    const previousStatus = booking.status;
    booking.status = status;

    if (status === 'rejected' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    if (status === 'completed') {
      booking.paymentStatus = 'paid';
      if (previousStatus !== 'completed') {
        await User.findByIdAndUpdate(booking.provider._id, { $inc: { completedJobs: 1 } });
      }
    }

    await booking.save();

    let notifUser = isCustomer ? booking.provider._id : booking.customer._id;
    let notifTitle = `Booking ${status.toUpperCase()}`;
    let notifMessage = `Your booking for "${booking.service.title}" has been updated to ${status}.`;

    if (status === 'accepted') {
      notifTitle = 'Booking Accepted';
      notifMessage = `Your booking request was accepted by ${booking.provider.name}.`;
    } else if (status === 'rejected') {
      notifTitle = 'Booking Declined';
      notifMessage = `Your booking request was declined by the provider.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`;
    } else if (status === 'completed') {
      notifTitle = 'Service Completed';
      notifMessage = 'Your service has been marked as completed.';
    } else if (status === 'cancelled') {
      notifTitle = 'Booking Cancelled';
      notifMessage = isCustomer ? `${booking.customer.name} cancelled the booking.` : `The provider cancelled the booking.`;
    }

    await Notification.create({
      user: notifUser,
      title: notifTitle,
      message: notifMessage,
      type: 'booking',
      link: isCustomer ? '/dashboard/provider' : '/dashboard/customer',
    });

    res.json({ success: true, message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    next(error);
  }
};
