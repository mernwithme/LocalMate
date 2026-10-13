import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { startTestServer, stopTestServer, clearDatabase, apiRequest } from './setup.js';
import { generateToken } from '../middleware/authMiddleware.js';

describe('Role-Based Access Control (RBAC) Tests', () => {
  let customerUser, providerUser, anotherProviderUser, adminUser;
  let customerToken, providerToken, anotherProviderToken, adminToken;
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
      name: 'Customer Priya',
      email: 'priya@test.com',
      password: 'Password123!',
      role: 'customer',
      address: { area: 'Gandhipuram', city: 'Coimbatore' },
    });
    customerToken = generateToken(customerUser._id);

    providerUser = await User.create({
      name: 'Provider Suresh',
      email: 'suresh@test.com',
      password: 'Password123!',
      role: 'provider',
      isApproved: true,
      verificationStatus: 'APPROVED',
      isVerifiedProvider: true,
      address: { area: 'Peelamedu', city: 'Coimbatore' },
    });
    providerToken = generateToken(providerUser._id);

    anotherProviderUser = await User.create({
      name: 'Provider Karthik',
      email: 'karthik@test.com',
      password: 'Password123!',
      role: 'provider',
      isApproved: true,
      verificationStatus: 'APPROVED',
      isVerifiedProvider: true,
      address: { area: 'RS Puram', city: 'Coimbatore' },
    });
    anotherProviderToken = generateToken(anotherProviderUser._id);

    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'Password123!',
      role: 'admin',
    });
    adminToken = generateToken(adminUser._id);

    testService = await Service.create({
      title: 'AC Maintenance & Deep Clean',
      description: 'Complete split AC cleaning in Peelamedu',
      category: 'Home & Emergency Services',
      price: 499,
      provider: providerUser._id,
      area: 'Peelamedu',
      location: 'Coimbatore',
      status: 'active',
    });
  });

  it('1. Customer cannot access Admin platform analytics (/api/admin/stats)', async () => {
    const res = await apiRequest('/api/admin/stats', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
    assert.ok(res.data.message.includes('not authorized'));
  });

  it('2. Provider cannot access Admin user management (/api/admin/users)', async () => {
    const res = await apiRequest('/api/admin/users', {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  it('3. Admin can access platform stats and user management', async () => {
    const res = await apiRequest('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.data.stats, 'Stats object must be returned');

    const usersRes = await apiRequest('/api/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(usersRes.status, 200);
    assert.equal(usersRes.data.success, true);
    assert.ok(Array.isArray(usersRes.data.users));
  });

  it('4. Customer cannot create a service listing', async () => {
    const res = await apiRequest('/api/services', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        title: 'Customer Unauthorized Service',
        description: 'Should fail',
        category: 'Vehicle Services',
        price: 300,
      },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  it('5. Approved Provider can create a service listing', async () => {
    const res = await apiRequest('/api/services', {
      method: 'POST',
      headers: { Authorization: `Bearer ${providerToken}` },
      body: {
        title: 'Ceiling Fan Repair & Coil Check',
        description: 'Doorstep electrical repair in Peelamedu',
        category: 'Home & Emergency Services',
        price: 250,
      },
    });
    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    assert.equal(res.data.service.title, 'Ceiling Fan Repair & Coil Check');
    assert.equal(res.data.service.provider.toString(), providerUser._id.toString());
  });

  it('6. Unapproved / Suspended Provider cannot create a service listing', async () => {
    const suspendedProvider = await User.create({
      name: 'Suspended Prov',
      email: 'suspended@test.com',
      password: 'Password123!',
      role: 'provider',
      isApproved: false,
      verificationStatus: 'SUSPENDED',
    });
    const suspendedToken = generateToken(suspendedProvider._id);

    const res = await apiRequest('/api/services', {
      method: 'POST',
      headers: { Authorization: `Bearer ${suspendedToken}` },
      body: {
        title: 'Suspended Service',
        category: 'Home & Emergency Services',
        price: 200,
      },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  it('7. Provider cannot modify another provider\'s service listing', async () => {
    const res = await apiRequest(`/api/services/${testService._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${anotherProviderToken}` },
      body: {
        title: 'Hijacked Service Title',
        price: 999,
      },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
    assert.ok(res.data.message.includes('Not authorized'));

    const serviceInDb = await Service.findById(testService._id);
    assert.equal(serviceInDb.title, 'AC Maintenance & Deep Clean');
  });

  it('8. Provider cannot delete another provider\'s service listing', async () => {
    const res = await apiRequest(`/api/services/${testService._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${anotherProviderToken}` },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);

    const serviceInDb = await Service.findById(testService._id);
    assert.ok(serviceInDb, 'Service must still exist');
  });

  it('9. Provider cannot reassign service ownership (provider ID injection)', async () => {
    const res = await apiRequest(`/api/services/${testService._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${providerToken}` },
      body: {
        provider: anotherProviderUser._id.toString(),
        title: 'Legitimate Title Update',
      },
    });
    assert.equal(res.status, 200);

    const serviceInDb = await Service.findById(testService._id);
    assert.equal(serviceInDb.provider.toString(), providerUser._id.toString(), 'Provider ID must not change');
    assert.equal(serviceInDb.title, 'Legitimate Title Update');
  });

  it('10. Admin can approve or suspend a provider account', async () => {
    const newProv = await User.create({
      name: 'Unverified Provider',
      email: 'unverified@test.com',
      password: 'Password123!',
      role: 'provider',
      isApproved: false,
      verificationStatus: 'PENDING',
    });

    const approveRes = await apiRequest(`/api/admin/users/${newProv._id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { verificationStatus: 'APPROVED' },
    });
    assert.equal(approveRes.status, 200);
    assert.equal(approveRes.data.user.verificationStatus, 'APPROVED');
    assert.equal(approveRes.data.user.isApproved, true);

    const suspendRes = await apiRequest(`/api/admin/users/${newProv._id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { verificationStatus: 'SUSPENDED' },
    });
    assert.equal(suspendRes.status, 200);
    assert.equal(suspendRes.data.user.verificationStatus, 'SUSPENDED');
    assert.equal(suspendRes.data.user.isApproved, false);
  });
});
