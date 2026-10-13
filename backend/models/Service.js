import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, default: '1-2 Hours' },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String }],
    location: { type: String, default: 'Peelamedu, Coimbatore' },
    area: { type: String, default: 'Peelamedu' },
    distanceKm: { type: Number, default: 1.5 },
    experienceRequired: { type: String, default: '3+ Years' },
    availability: { type: String, default: 'Available Now' },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isRental: { type: Boolean, default: false },
    hourlyPrice: { type: Number, default: 0 },
    dailyPrice: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    pickupLocation: { type: String, default: 'Gandhipuram, Coimbatore' },
    helmetAvailable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
