import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app.js';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers/testSetup.js';
import { User } from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ─────────────────────────────────────────────
//  SETUP & TEARDOWN
// ─────────────────────────────────────────────

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearCollections();
});

// ─────────────────────────────────────────────
//  HELPER — reusable valid registration payload
// ─────────────────────────────────────────────

// Your validator requires:
//   name (min 2), email (valid), password (8+ chars, upper, lower, number), role
// Phone is optional. We skip it to keep tests simple.

const validDriverPayload = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  password: 'Test@1234',   // has upper, lower, number, 8+ chars
  role: 'driver',
};

// ─────────────────────────────────────────────
//  TESTS 1–4: POST /api/auth/register
// ─────────────────────────────────────────────

describe('POST /api/auth/register', () => {

  // TEST 1 — happy path
  it('should register a new user and return token + user data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validDriverPayload)
      .expect(201);

    // Response shape: { success: true, data: { user: {...}, token: "..." } }
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');

    // User object should have key fields
    const { user } = response.body.data;
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('rahul@example.com');
    expect(user.role).toBe('driver');

    // IMPORTANT: password should NEVER appear in the response
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('passwordHash');
  });

  // TEST 2 — duplicate email
  it('should return 409 if email is already registered', async () => {
    // Register once successfully
    await request(app)
      .post('/api/auth/register')
      .send(validDriverPayload)
      .expect(201);

    // Try to register again with same email
    const response = await request(app)
      .post('/api/auth/register')
      .send(validDriverPayload)
      .expect(409); // 409 = Conflict

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/already exists/i);
  });

  // TEST 3 — weak password
  it('should return 400 if password does not meet requirements', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        ...validDriverPayload,
        password: 'weak',  // too short, no uppercase, no number
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Request validation failed');
    // errors array should mention the password field
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'password' })
      ])
    );
  });

  // TEST 4 — invalid email
  it('should return 400 if email format is invalid', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        ...validDriverPayload,
        email: 'not-an-email',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'email' })
      ])
    );
  });
});

// ─────────────────────────────────────────────
//  TESTS 5–7: POST /api/auth/login
// ─────────────────────────────────────────────

describe('POST /api/auth/login', () => {

  // Create a user before each login test
  // Note: registerUser service hashes with bcrypt — so we register via API,
  // not directly via User.create(), to get the hash done correctly.
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send(validDriverPayload);
  });

  // TEST 5 — happy path
  it('should login and return a valid JWT token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'rahul@example.com',
        password: 'Test@1234',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');

    // Verify the token is actually a real JWT (3 parts separated by dots)
    const { token } = response.body.data;
    const parts = token.split('.');
    expect(parts).toHaveLength(3);
  });

  // TEST 6 — wrong password
  it('should return 401 if password is incorrect', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'rahul@example.com',
        password: 'WrongPass999',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    // Should NOT reveal whether email exists (security best practice)
    expect(response.body.message).toMatch(/invalid email or password/i);
  });

  // TEST 7 — email not found
  it('should return 401 if email does not exist', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nobody@example.com',
        password: 'Test@1234',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    // Same generic message — attacker cannot distinguish "wrong password" from "no account"
    expect(response.body.message).toMatch(/invalid email or password/i);
  });
});

// ─────────────────────────────────────────────
//  TESTS 8–10: RBAC — GET /api/admin/dashboard
// ─────────────────────────────────────────────

describe('RBAC — GET /api/admin/dashboard', () => {

  // TEST 8 — driver tries to access admin route
  it('should return 403 when a driver tries to access an admin route', async () => {
    // Create a driver and get their token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(validDriverPayload);

    const driverToken = registerRes.body.data.token;

    const response = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${driverToken}`)
      .expect(403); // 403 = Forbidden (authenticated but wrong role)

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/permission/i);
  });

  // TEST 9 — no token at all
  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .get('/api/admin/dashboard')
      // No .set('Authorization', ...) — intentionally missing
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  // TEST 10 — fake / tampered JWT
  it('should return 401 when JWT is invalid or tampered', async () => {
    const response = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', 'Bearer this.is.not.a.real.jwt')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/invalid|expired/i);
  });
});