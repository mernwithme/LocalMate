import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
    phone: { type: String, default: '' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
    address: {
      street: { type: String, default: '' },
      landmark: { type: String, default: '' },
      area: { type: String, default: 'Gandhipuram' },
      city: { type: String, default: 'Coimbatore' },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: { type: String, default: '641012' },
    },
    whatsapp: { type: String, default: '' },
    emergencyAvailable: { type: Boolean, default: false },
    preferredTimeSlot: { type: String, default: 'Morning (9:00 AM - 1:00 PM)' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
    startingPrice: { type: Number, default: 199 },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    isVerifiedProvider: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'APPROVED',
    },
    availabilityStatus: {
      type: String,
      enum: ['Available Now', 'Busy', 'Offline'],
      default: 'Available Now',
    },
    serviceAreas: [{ type: String, default: ['Gandhipuram', 'RS Puram', 'Peelamedu'] }],
    availability: {
      days: [{ type: String, default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }],
      hours: { type: String, default: '8:00 AM - 8:00 PM' },
    },
    portfolio: [
      {
        title: String,
        image: String,
        description: String,
      },
    ],
    socialLinks: {
      website: String,
      github: String,
      linkedin: String,
      twitter: String,
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
