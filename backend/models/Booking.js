import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: '' },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'on_the_way', 'started', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentId: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.virtual('date').get(function () {
  return this.bookingDate;
});
bookingSchema.virtual('time').get(function () {
  return this.timeSlot;
});
bookingSchema.virtual('message').get(function () {
  return this.notes;
});
bookingSchema.virtual('price').get(function () {
  return this.totalAmount;
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
