import Service from '../models/Service.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

export const getServices = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, rating, location, area, availableNow, provider, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (provider) {
      query.provider = provider;
    } else {
      query.status = 'active';

      const approvedProviders = await User.find({
        role: 'provider',
        isApproved: true,
        verificationStatus: { $nin: ['PENDING', 'REJECTED', 'SUSPENDED'] },
      }).select('_id');
      const approvedIds = approvedProviders.map((p) => p._id);
      query.provider = { $in: approvedIds };
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { area: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (area && area !== 'All Areas') {
      query.$or = [
        { area: { $regex: area, $options: 'i' } },
        { location: { $regex: area, $options: 'i' } },
      ];
    }

    if (availableNow === 'true' || availableNow === true) {
      query.availability = { $regex: 'Available Now', $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (location && location !== 'Coimbatore') {
      query.location = { $regex: location, $options: 'i' };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low' || sort === 'lowest-price') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };
    if (sort === 'top-rated' || sort === 'highest-rating') sortOptions = { rating: -1 };
    if (sort === 'nearest') sortOptions = { distanceKm: 1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const count = await Service.countDocuments(query);
    const services = await Service.find(query)
      .populate('provider', 'name email avatar phone rating numReviews bio skills address isVerifiedProvider verificationStatus availabilityStatus completedJobs serviceAreas startingPrice')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    res.json({
      success: true,
      count,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      services,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'provider',
      'name email avatar phone rating numReviews bio skills experienceYears availability portfolio address isVerifiedProvider verificationStatus availabilityStatus'
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service listing not found' });
    }

    res.json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    if (
      req.user.role === 'provider' &&
      (!req.user.isApproved ||
        req.user.verificationStatus === 'SUSPENDED' ||
        req.user.verificationStatus === 'REJECTED')
    ) {
      return res.status(403).json({
        success: false,
        message: 'Your provider account is currently not approved to list services.',
      });
    }

    const {
      title,
      description,
      category,
      price,
      duration,
      images,
      location,
      area,
      experienceRequired,
      tags,
      isRental,
      hourlyPrice,
      dailyPrice,
      securityDeposit,
      pickupLocation,
    } = req.body;

    const service = await Service.create({
      title,
      description: description || 'Professional verified local service in Coimbatore.',
      category: category || 'Home & Emergency Services',
      price: Number(price) || 299,
      duration: duration || '1-2 Hours',
      provider: req.user._id,
      images: images || ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
      location: location || 'Coimbatore, TN',
      area: area || req.user.address?.area || 'Peelamedu',
      experienceRequired: experienceRequired || '3+ Years',
      tags: tags || [category || 'Service'],
      isRental: Boolean(isRental),
      hourlyPrice: hourlyPrice ? Number(hourlyPrice) : 0,
      dailyPrice: dailyPrice ? Number(dailyPrice) : 0,
      securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
      pickupLocation: pickupLocation || location || 'Coimbatore, TN',
    });

    await Category.findOneAndUpdate({ name: category }, { $inc: { serviceCount: 1 } });

    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this service' });
    }

    const updateData = { ...req.body };
    if (req.user.role !== 'admin') {
      delete updateData.provider;
      delete updateData.rating;
      delete updateData.numReviews;
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
    }

    await service.deleteOne();
    await Category.findOneAndUpdate({ name: service.category }, { $inc: { serviceCount: -1 } });

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
