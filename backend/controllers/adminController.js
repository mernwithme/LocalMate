import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Category from '../models/Category.js';
import Payment from '../models/Payment.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalServices = await Service.countDocuments({});
    const totalBookings = await Booking.countDocuments({});
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const pendingApprovalProviders = await User.countDocuments({
      role: 'provider',
      $or: [{ verificationStatus: 'PENDING' }, { isVerifiedProvider: false }],
    });

    const totalRevenueResult = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 14850;

    const recentBookings = await Booking.find({})
      .populate('customer', 'name email avatar phone')
      .populate('provider', 'name email avatar phone')
      .populate('service', 'title price category')
      .sort({ createdAt: -1 })
      .limit(8);

    const pendingProviders = await User.find({
      role: 'provider',
      $or: [{ verificationStatus: 'PENDING' }, { isVerifiedProvider: false }],
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalProviders,
        totalServices,
        totalBookings,
        completedBookings,
        pendingBookings,
        pendingApprovalProviders,
        totalRevenue,
      },
      recentBookings,
      pendingProviders,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, verificationStatus } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (verificationStatus) filter.verificationStatus = verificationStatus;

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const createProviderByAdmin = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      avatar,
      skills,
      experienceYears,
      bio,
      location,
      area,
      serviceAreas,
      hourlyRate,
      startingPrice,
      verificationStatus,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user already exists with this email address.' });
    }

    const finalStatus = verificationStatus || 'APPROVED';
    const isApproved = finalStatus === 'APPROVED';

    const provider = await User.create({
      name,
      email,
      password,
      role: 'provider',
      phone: phone || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
      experienceYears: Number(experienceYears) || 0,
      hourlyRate: Number(hourlyRate) || 0,
      startingPrice: Number(startingPrice) || 249,
      address: {
        street: req.body.street || '',
        area: area || location || 'Peelamedu',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: req.body.pincode || '641004',
      },
      serviceAreas: serviceAreas
        ? Array.isArray(serviceAreas)
          ? serviceAreas
          : serviceAreas.split(',').map((s) => s.trim())
        : [area || 'Peelamedu', 'Gandhipuram'],
      verificationStatus: finalStatus,
      isVerifiedProvider: isApproved,
      isApproved,
      availabilityStatus: 'Available Now',
    });

    res.status(201).json({
      success: true,
      message: `Provider account for ${provider.name} created successfully.`,
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        role: provider.role,
        phone: provider.phone,
        verificationStatus: provider.verificationStatus,
        isApproved: provider.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Provider not found.' });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.experienceYears !== undefined) user.experienceYears = Number(req.body.experienceYears);
    if (req.body.startingPrice !== undefined) user.startingPrice = Number(req.body.startingPrice);
    if (req.body.skills) {
      user.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map((s) => s.trim());
    }
    if (req.body.serviceAreas) {
      user.serviceAreas = Array.isArray(req.body.serviceAreas)
        ? req.body.serviceAreas
        : req.body.serviceAreas.split(',').map((s) => s.trim());
    }
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }
    if (req.body.verificationStatus) {
      user.verificationStatus = req.body.verificationStatus;
      user.isApproved = req.body.verificationStatus === 'APPROVED';
      user.isVerifiedProvider = req.body.verificationStatus === 'APPROVED';
    }

    await user.save();
    res.json({ success: true, message: 'Provider profile updated successfully.', user });
  } catch (error) {
    next(error);
  }
};

export const updateProviderStatus = async (req, res, next) => {
  try {
    const { status, verificationStatus } = req.body;
    const finalStatus = (verificationStatus || status || '').toUpperCase();

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
    if (!validStatuses.includes(finalStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verificationStatus = finalStatus;
    user.isApproved = finalStatus === 'APPROVED';
    user.isVerifiedProvider = finalStatus === 'APPROVED';
    await user.save();

    res.json({
      success: true,
      message: `Provider ${user.name} status updated to ${finalStatus}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const approveProvider = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerifiedProvider = true;
    user.isApproved = true;
    user.verificationStatus = 'APPROVED';
    await user.save();

    res.json({ success: true, message: `Provider ${user.name} has been approved!`, user });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('customer', 'name email phone avatar address')
      .populate('provider', 'name email phone avatar rating address isVerifiedProvider verificationStatus')
      .populate('service', 'title price category duration location area')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const deleteOrBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin account' });
    }

    await user.deleteOne();
    res.json({ success: true, message: `User ${user.name} removed successfully.` });
  } catch (error) {
    next(error);
  }
};
