import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { startTestServer, stopTestServer, clearDatabase, apiRequest } from './setup.js';

describe('Authentication & Authorization Tests', () => {
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

  it('1. Should register a customer with valid information', async () => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Aravind Swamy',
        email: 'aravind@example.com',
        password: 'Password123!',
        role: 'customer',
        phone: '+91 9840123456',
        area: 'Gandhipuram',
      },
    });

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    assert.equal(res.data.user.role, 'customer');
    assert.equal(res.data.user.email, 'aravind@example.com');
    assert.ok(res.data.token, 'JWT token must be returned');
    assert.equal(res.data.user.password, undefined, 'Password must not be in user object');

    const dbUser = await User.findOne({ email: 'aravind@example.com' });
    assert.ok(dbUser, 'User must exist in DB');
    assert.notEqual(dbUser.password, 'Password123!', 'Password must be hashed in DB');
    const isMatch = await bcrypt.compare('Password123!', dbUser.password);
    assert.equal(isMatch, true, 'Stored hash must match password');
  });

  it('2. Should register a provider with PENDING verification status', async () => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Karthik Electrician',
        email: 'karthik.provider@example.com',
        password: 'Password123!',
        role: 'provider',
        phone: '+91 9842222002',
        skills: ['Wiring', 'Lighting'],
        experienceYears: 5,
        hourlyRate: 300,
        area: 'Peelamedu',
      },
    });

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    assert.equal(res.data.user.role, 'provider');
    assert.equal(res.data.user.verificationStatus, 'PENDING');
    assert.equal(res.data.user.isApproved, false);
  });

  it('3. Security Check: Prevent privilege escalation via registration (role: admin)', async () => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Hacker User',
        email: 'hacker@example.com',
        password: 'Password123!',
        role: 'admin',
      },
    });

    if (res.status === 201) {
      assert.notEqual(res.data.user.role, 'admin', 'Public registration must never create an admin');
      assert.equal(res.data.user.role, 'customer');
    } else {
      assert.equal(res.status, 400);
    }

    const dbUser = await User.findOne({ email: 'hacker@example.com' });
    if (dbUser) {
      assert.notEqual(dbUser.role, 'admin', 'Admin role must not be set in database');
    }
  });

  it('4. Should login with valid credentials', async () => {
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Customer',
        email: 'login.test@example.com',
        password: 'Password123!',
      },
    });

    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'login.test@example.com',
        password: 'Password123!',
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.data.token, 'Token must be returned');
    assert.equal(res.data.user.email, 'login.test@example.com');
  });

  it('5. Should reject login with an incorrect password', async () => {
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'wrongpass@example.com',
        password: 'Password123!',
      },
    });

    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'wrongpass@example.com',
        password: 'WrongPassword!',
      },
    });

    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
    assert.equal(res.data.message, 'Invalid email or password');
  });

  it('6. Should reject login with an unknown email', async () => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      },
    });

    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
  });

  it('7. Should reject registration with an existing email', async () => {
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'Password123!',
      },
    });

    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'Password123!',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.message.includes('already exists'));
  });

  it('8. Should reject registration with missing required fields', async () => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: '',
        email: '',
        password: '',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
  });

  it('9. Should reject registration with invalid email format', async () => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Invalid Email User',
        email: 'invalid-email-address',
        password: 'Password123!',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
  });

  it('10. Should reject registration with weak/short password (< 6 chars)', async () => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Short Password User',
        email: 'shortpass@example.com',
        password: '123',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
  });

  it('11. Should reject access to protected routes without a token', async () => {
    const res = await apiRequest('/api/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
  });

  it('12. Should reject access to protected routes with a malformed/invalid token', async () => {
    const res = await apiRequest('/api/auth/me', {
      headers: { Authorization: 'Bearer this.is.invalid.jwt.token' },
    });
    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
  });

  it('13. Should successfully logout and invalidate token cookie', async () => {
    const res = await apiRequest('/api/auth/logout', { method: 'POST' });
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
  });
});
