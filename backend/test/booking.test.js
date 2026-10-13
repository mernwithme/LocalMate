import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { startTestServer, stopTestServer, clearDatabase, apiRequest } from './setup.js';
import { generateToken } from '../middleware/authMiddleware.js';

describe('Complete Booking Lifecycle & Reviews Tests', () => {
  let customerUser, providerUser, anotherProviderUser;
  let customerToken, providerToken, anotherProviderToken;
  let testService;

  before(async () => {
    await startTestServer();
  });

  after(async () => {
    await clearDatabase();
    await stopTestServer();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();

    customerUser = await User.create({
      name: 'Ravi Kumar',
      email: 'ravi@test.com',
      password: 'Password123!',
      role: 'customer',
      address: { street: '45 Cross Cut Rd', area: 'Gandhipuram', city: 'Coimbatore' },
    });
    customerToken = generateToken(customerUser._id);

    providerUser = await User.create({
      name: 'Suresh Electrician',
      email: 'suresh.booking@test.com',
      password: 'Password123!',
      role: 'provider',
      isApproved: true,
      verificationStatus: 'APPROVED',
      isVerifiedProvider: true,
      rating: 4.8,
      numReviews: 10,
      completedJobs: 5,
      address: { street: '12 Avinashi Rd', area: 'Peelamedu', city: 'Coimbatore' },
    });
    providerToken = generateToken(providerUser._id);

    anotherProviderUser = await User.create({
      name: 'Another Plumber',
      email: 'plumber@test.com',
      password: 'Password123!',
      role: 'provider',
      isApproved: true,
      verificationStatus: 'APPROVED',
      isVerifiedProvider: true,
    });
    anotherProviderToken = generateToken(anotherProviderUser._id);

    testService = await Service.create({
      title: 'Emergency Power Circuit Repair',
      description: 'Quick resolution for tripped breakers and power shorts in Coimbatore',
      category: 'Home & Emergency Services',
      price: 350,
      provider: providerUser._id,
      area: 'Gandhipuram',
      location: 'Coimbatore',
      status: 'active',
    });
  });

  it('1. Customer cannot book with a past date', async () => {
    const res = await apiRequest('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        serviceId: testService._id,
        bookingDate: '2020-01-01',
        timeSlot: '10:00 AM - 12:00 PM',
        address: '45 Cross Cut Rd, Gandhipuram',
      },
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.message.includes('past'));
  });

  it('2. Customer cannot book with invalid date format', async () => {
    const res = await apiRequest('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        serviceId: testService._id,
        bookingDate: 'invalid-date-string',
        timeSlot: '10:00 AM - 12:00 PM',
        address: '45 Cross Cut Rd, Gandhipuram',
      },
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.message.includes('Invalid'));
  });

  it('3. Provider cannot book their own service listing', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const res = await apiRequest('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${providerToken}` },
      body: {
        serviceId: testService._id,
        bookingDate: dateStr,
        timeSlot: '10:00 AM - 12:00 PM',
        address: '12 Avinashi Rd',
      },
    });
    assert.equal(res.status, 403);
  });

  it('4. Full Lifecycle: Create -> Accept -> OnTheWay -> Started -> Completed -> Review', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const validDate = tomorrow.toISOString().split('T')[0];

    const createRes = await apiRequest('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        serviceId: testService._id,
        bookingDate: validDate,
        timeSlot: '11:00 AM - 01:00 PM',
        address: '45 Cross Cut Rd, Gandhipuram, Coimbatore',
        notes: 'Main board sparking near kitchen',
      },
    });

    assert.equal(createRes.status, 201);
    assert.equal(createRes.data.success, true);
    const bookingId = createRes.data.booking._id;
    assert.equal(createRes.data.booking.status, 'pending');
    assert.equal(createRes.data.booking.totalAmount, 350, 'Price must match service price');

    const notif = await Notification.findOne({ user: providerUser._id });
    assert.ok(notif, 'Notification must be created for assigned provider');

    const unauthorizedAccept = await apiRequest(`/api/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${anotherProviderToken}` },
    });
    assert.equal(unauthorizedAccept.status, 403);

    const acceptRes = await apiRequest(`/api/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    assert.equal(acceptRes.status, 200);
    assert.equal(acceptRes.data.booking.status, 'accepted');

    const doubleAccept = await apiRequest(`/api/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    assert.equal(doubleAccept.status, 400);

    const onTheWayRes = await apiRequest(`/api/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${providerToken}` },
      body: { status: 'on_the_way' },
    });
    assert.equal(onTheWayRes.status, 200);
    assert.equal(onTheWayRes.data.booking.status, 'on_the_way');

    const startRes = await apiRequest(`/api/bookings/${bookingId}/start`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    assert.equal(startRes.status, 200);
    assert.equal(startRes.data.booking.status, 'started');

    const completeRes = await apiRequest(`/api/bookings/${bookingId}/complete`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    assert.equal(completeRes.status, 200);
    assert.equal(completeRes.data.booking.status, 'completed');
    assert.equal(completeRes.data.booking.paymentStatus, 'paid');

    const updatedProvider = await User.findById(providerUser._id);
    assert.equal(updatedProvider.completedJobs, 6, 'Completed jobs counter must increment');

    const cancelCompleted = await apiRequest(`/api/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(cancelCompleted.status, 400);
    assert.ok(cancelCompleted.data.message.includes('Completed bookings cannot be cancelled'));

    const reviewRes = await apiRequest('/api/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        serviceId: testService._id,
        bookingId,
        rating: 5,
        comment: 'Excellent service! Arrived in 20 minutes and fixed the trip.',
      },
    });
    assert.equal(reviewRes.status, 201);
    assert.equal(reviewRes.data.success, true);
    assert.equal(reviewRes.data.review.rating, 5);

    const duplicateReviewRes = await apiRequest('/api/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        serviceId: testService._id,
        bookingId,
        rating: 4,
        comment: 'Trying to leave another review',
      },
    });
    assert.equal(duplicateReviewRes.status, 400);
    assert.ok(duplicateReviewRes.data.message.includes('already been submitted'));
  });

  it('5. Customer can cancel a pending booking', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    const booking = await Booking.create({
      customer: customerUser._id,
      provider: providerUser._id,
      service: testService._id,
      bookingDate: futureDate.toISOString().split('T')[0],
      timeSlot: '02:00 PM - 04:00 PM',
      address: '45 Cross Cut Rd, Gandhipuram',
      totalAmount: 350,
      status: 'pending',
    });

    const res = await apiRequest(`/api/bookings/${booking._id}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${customerToken}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.booking.status, 'cancelled');

    const dbBooking = await Booking.findById(booking._id);
    assert.equal(dbBooking.status, 'cancelled');
  });

  it('6. Provider can reject a pending booking with a reason', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    const booking = await Booking.create({
      customer: customerUser._id,
      provider: providerUser._id,
      service: testService._id,
      bookingDate: futureDate.toISOString().split('T')[0],
      timeSlot: '02:00 PM - 04:00 PM',
      address: '45 Cross Cut Rd, Gandhipuram',
      totalAmount: 350,
      status: 'pending',
    });

    const res = await apiRequest(`/api/bookings/${booking._id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${providerToken}` },
      body: { reason: 'Already booked on another emergency site in Gandhipuram' },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.booking.status, 'rejected');
    assert.equal(res.data.booking.rejectionReason, 'Already booked on another emergency site in Gandhipuram');
  });

  it('7. Customer cannot review a service without a completed booking', async () => {
    const res = await apiRequest('/api/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        serviceId: testService._id,
        rating: 5,
        comment: 'Trying to review without ever booking',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.message.includes('completed booking'));
  });
});
