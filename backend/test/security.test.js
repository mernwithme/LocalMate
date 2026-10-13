import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { startTestServer, stopTestServer, clearDatabase, apiRequest } from './setup.js';
import { generateToken } from '../middleware/authMiddleware.js';

describe('Security & Data Protection Tests', () => {
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
  });

  it('1. Should reject NoSQL injection attempts on login endpoint', async () => {
    await User.create({
      name: 'Legitimate Admin',
      email: 'admin.legit@test.com',
      password: 'Password123!',
      role: 'admin',
    });

    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: { $gt: '' },
        password: { $gt: '' },
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.message.includes('valid'));
  });

  it('2. Password hash must NEVER be exposed in any JSON responses', async () => {
    const admin = await User.create({
      name: 'Security Admin',
      email: 'security.admin@test.com',
      password: 'Password123!',
      role: 'admin',
    });
    const adminToken = generateToken(admin._id);

    const provider = await User.create({
      name: 'Sample Provider',
      email: 'sample.prov@test.com',
      password: 'Password123!',
      role: 'provider',
    });

    const meRes = await apiRequest('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(meRes.data.user.password, undefined);

    const usersRes = await apiRequest('/api/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    usersRes.data.users.forEach((u) => {
      assert.equal(u.password, undefined, `User ${u.email} must not have password exposed`);
    });

    const statusRes = await apiRequest(`/api/admin/users/${provider._id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { verificationStatus: 'APPROVED' },
    });
    assert.equal(statusRes.data.user.password, undefined, 'Status update must not expose password');
  });

  it('3. Cross-User Data Isolation: Customers can only see their own bookings', async () => {
    const customer1 = await User.create({
      name: 'Customer 1',
      email: 'cust1@test.com',
      password: 'Password123!',
      role: 'customer',
    });
    const customer2 = await User.create({
      name: 'Customer 2',
      email: 'cust2@test.com',
      password: 'Password123!',
      role: 'customer',
    });
    const provider = await User.create({
      name: 'Provider Common',
      email: 'prov.common@test.com',
      password: 'Password123!',
      role: 'provider',
      isApproved: true,
      verificationStatus: 'APPROVED',
    });

    const service = await Service.create({
      title: 'Common Plumbing Service',
      description: 'Reliable plumbing maintenance in Coimbatore',
      category: 'Home & Emergency Services',
      price: 200,
      provider: provider._id,
    });

    await Booking.create({
      customer: customer1._id,
      provider: provider._id,
      service: service._id,
      bookingDate: '2026-11-01',
      timeSlot: '09:00 AM - 11:00 AM',
      address: 'Cust 1 Address',
      totalAmount: 200,
      status: 'pending',
    });

    await Booking.create({
      customer: customer2._id,
      provider: provider._id,
      service: service._id,
      bookingDate: '2026-11-02',
      timeSlot: '02:00 PM - 04:00 PM',
      address: 'Cust 2 Address',
      totalAmount: 200,
      status: 'pending',
    });

    const token1 = generateToken(customer1._id);
    const res1 = await apiRequest('/api/bookings', {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert.equal(res1.status, 200);
    assert.equal(res1.data.count, 1);
    assert.equal(res1.data.bookings[0].address, 'Cust 1 Address');

    const token2 = generateToken(customer2._id);
    const res2 = await apiRequest('/api/bookings', {
      headers: { Authorization: `Bearer ${token2}` },
    });
    assert.equal(res2.status, 200);
    assert.equal(res2.data.count, 1);
    assert.equal(res2.data.bookings[0].address, 'Cust 2 Address');
  });

  it('4. CORS Rejection: Unauthorized origins are blocked', async () => {
    const res = await apiRequest('/api/health', {
      headers: { Origin: 'https://malicious-attacker-site.com' },
    });
    assert.ok(res.status === 500 || res.status === 403 || !res.headers.get('access-control-allow-origin') || res.headers.get('access-control-allow-origin') !== 'https://malicious-attacker-site.com');
  });
});
