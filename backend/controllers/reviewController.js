import Review from '../models/Review.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

export const createReview = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can leave reviews.',
      });
    }

    const { serviceId, providerId, bookingId, rating, comment, images } = req.body;

    let validBooking = null;
    if (bookingId) {
      validBooking = await Booking.findOne({
        _id: bookingId,
        customer: req.user._id,
        status: 'completed',
      });
      if (!validBooking) {
        return res.status(400).json({
          success: false,
          message: 'You can only review a service after the booking is completed.',
        });
      }
    } else {
      validBooking = await Booking.findOne({
        customer: req.user._id,
        service: serviceId,
        status: 'completed',
      }).sort({ updatedAt: -1 });

      if (!validBooking) {
        return res.status(400).json({
          success: false,
          message: 'Only customers with a completed booking can leave a review.',
        });
      }
    }

    const existing = await Review.findOne({ booking: validBooking._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A review has already been submitted for this completed booking.',
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a valid number between 1 and 5.',
      });
    }

    const finalProviderId = providerId || validBooking.provider;

    const review = await Review.create({
      user: req.user._id,
      service: serviceId,
      provider: finalProviderId,
      booking: validBooking._id,
      rating: numericRating,
      comment: (comment || '').trim(),
      images: images || [],
    });

    const serviceReviews = await Review.find({ service: serviceId });
    const avgRating = serviceReviews.reduce((acc, item) => item.rating + acc, 0) / serviceReviews.length;

    await Service.findByIdAndUpdate(serviceId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: serviceReviews.length,
    });

    if (finalProviderId) {
      const providerReviews = await Review.find({ provider: finalProviderId });
      if (providerReviews.length > 0) {
        const providerAvg = providerReviews.reduce((acc, item) => item.rating + acc, 0) / providerReviews.length;
        await User.findByIdAndUpdate(finalProviderId, {
          rating: Math.round(providerAvg * 10) / 10,
          numReviews: providerReviews.length,
        });
      }
    }

    res.status(201).json({ success: true, message: 'Review published successfully', review });
  } catch (error) {
    next(error);
  }
};

export const getServiceReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};
