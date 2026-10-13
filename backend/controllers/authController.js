import User from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, skills, experienceYears, bio, hourlyRate, city } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const safeRole = role === 'provider' ? 'provider' : 'customer';

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: safeRole,
      phone: typeof phone === 'string' ? phone.trim() : '',
      skills: Array.isArray(skills) ? skills : skills && typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : [],
      experienceYears: experienceYears ? Number(experienceYears) : 0,
      bio: typeof bio === 'string' ? bio.trim() : '',
      hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
      address: {
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        area: req.body.area || 'Gandhipuram',
        street: req.body.street || '',
      },
      availabilityStatus: req.body.availabilityStatus || 'Available Now',
      startingPrice: req.body.startingPrice ? Number(req.body.startingPrice) : 199,
      serviceAreas: req.body.serviceAreas || ['Gandhipuram', 'RS Puram', 'Peelamedu'],
      isVerifiedProvider: safeRole === 'provider' ? false : true,
      verificationStatus: safeRole === 'provider' ? 'PENDING' : 'APPROVED',
      isApproved: safeRole === 'provider' ? false : true,
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        skills: user.skills,
        rating: user.rating,
        isVerifiedProvider: user.isVerifiedProvider,
        verificationStatus: user.verificationStatus,
        isApproved: user.isApproved,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide valid email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (user && (await user.matchPassword(password))) {
      if (user.verificationStatus === 'SUSPENDED') {
        return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator.' });
      }

      const token = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          bio: user.bio,
          skills: user.skills,
          rating: user.rating,
          isVerifiedProvider: user.isVerifiedProvider,
          verificationStatus: user.verificationStatus || (user.isApproved ? 'APPROVED' : 'PENDING'),
          isApproved: user.isApproved,
          favorites: user.favorites,
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('favorites');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone ?? user.phone;
      user.whatsapp = req.body.whatsapp ?? user.whatsapp;
      user.avatar = req.body.avatar || user.avatar;
      user.bio = req.body.bio ?? user.bio;
      user.hourlyRate = req.body.hourlyRate ?? user.hourlyRate;
      user.startingPrice = req.body.startingPrice ?? user.startingPrice;
      user.experienceYears = req.body.experienceYears ?? user.experienceYears;
      if (req.body.emergencyAvailable !== undefined) {
        user.emergencyAvailable = Boolean(req.body.emergencyAvailable);
      }
      if (req.body.preferredTimeSlot) {
        user.preferredTimeSlot = req.body.preferredTimeSlot;
      }
      if (req.body.availabilityStatus) {
        user.availabilityStatus = req.body.availabilityStatus;
      }
      if (req.body.serviceAreas) {
        user.serviceAreas = Array.isArray(req.body.serviceAreas)
          ? req.body.serviceAreas
          : req.body.serviceAreas.split(',').map((s) => s.trim());
      }

      if (req.body.skills) {
        user.skills = Array.isArray(req.body.skills)
          ? req.body.skills
          : req.body.skills.split(',').map((s) => s.trim());
      }

      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      if (req.body.password && req.body.password.trim().length >= 6) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
          whatsapp: updatedUser.whatsapp,
          bio: updatedUser.bio,
          skills: updatedUser.skills,
          address: updatedUser.address,
          rating: updatedUser.rating,
          completedJobs: updatedUser.completedJobs,
          availabilityStatus: updatedUser.availabilityStatus,
          startingPrice: updatedUser.startingPrice,
          hourlyRate: updatedUser.hourlyRate,
          experienceYears: updatedUser.experienceYears,
          emergencyAvailable: updatedUser.emergencyAvailable,
          preferredTimeSlot: updatedUser.preferredTimeSlot,
          serviceAreas: updatedUser.serviceAreas,
          isVerifiedProvider: updatedUser.isVerifiedProvider,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }
    const avatarUrl = `/uploads/${req.file.filename}`;

    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.avatar = avatarUrl;
        await user.save();
      }
    }

    res.json({
      success: true,
      url: avatarUrl,
      avatar: avatarUrl,
      message: 'Profile photo uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};
