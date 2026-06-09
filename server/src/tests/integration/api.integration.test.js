import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app.js';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers/testSetup.js';
import { User } from '../../models/user.model.js';
import { Parking } from '../../models/parking.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ─────────────────────────────────────────────
//  SETUP & TEARDOWN
// ─────────────────────────────────────────────

let driverToken;
let driverUser;
let testParking;

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearCollections();

  // Create a test driver — status defaults to 'active' so no need to set it
  const hashedPassword = await bcrypt.hash('Test@1234', 10);
  driverUser = await User.create({
    name: 'Test Driver',
    email: 'driver@test.com',
    password: hashedPassword,
    role: 'driver',
  });

  // ✅ Sign JWT the same way your app does: role in body, _id as subject
  driverToken = jwt.sign(
    { role: 'driver' },
    process.env.JWT_SECRET,
    { subject: driverUser._id.toString(), expiresIn: '1h' }
  );

  // Create a test parking with all required fields
  testParking = await Parking.create({
    title: 'Test Parking Mumbai',
    description: 'A reliable test parking spot in the heart of Mumbai city.',
    address: '123 Test Street, Andheri',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
    },
    totalSlots: 10,
    availableSlots: 10,
    hourlyPrice: 50,
    vehicleTypes: ['4-wheeler'],
    verificationStatus: 'approved',
    owner: driverUser._id,
  });
});

// ─────────────────────────────────────────────
//  TEST 1 & 2: GET /api/parkings
// ─────────────────────────────────────────────

describe('GET /api/parkings', () => {
  it('should return a list of approved parking spots', async () => {
    const response = await request(app)
      .get('/api/parkings')
      .expect(200);

    // ✅ Real shape: { success: true, data: { parkings: [...], pagination: {} } }
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('parkings');
    expect(Array.isArray(response.body.data.parkings)).toBe(true);
    expect(response.body.data.parkings.length).toBeGreaterThan(0);
  });

  it('should return parking with correct fields', async () => {
    const response = await request(app)
      .get('/api/parkings')
      .expect(200);

    const parking = response.body.data.parkings[0];
    // ✅ Real field names from serializeParking()
    expect(parking).toHaveProperty('title');
    expect(parking).toHaveProperty('hourlyPrice');
    expect(parking).toHaveProperty('city');
  });
});

// ─────────────────────────────────────────────
//  TEST 3 & 4: POST /api/bookings
// ─────────────────────────────────────────────

describe('POST /api/bookings', () => {
  it('should return 401 if no auth token provided', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({ parkingId: testParking._id })
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 if booking data is invalid', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${driverToken}`)
      // ✅ Token is now valid — middleware passes, validator catches missing fields → 400
      .send({ parkingId: testParking._id }) // missing bookingDate, startTime, endTime etc.
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });
});

// ─────────────────────────────────────────────
//  TEST 5 & 6: POST /api/payments/create-order
// ─────────────────────────────────────────────

describe('POST /api/payments/create-order', () => {
  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app)
      .post('/api/payments/create-order')
      .send({ bookingId: 'some-id' })
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 or 404 for a non-existent booking', async () => {
    const fakeBookingId = '64f1a2b3c4d5e6f7a8b9c0d1';

    const response = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${driverToken}`)
      // ✅ Token is now valid — auth passes, booking lookup fails → 400 or 404
      .send({ bookingId: fakeBookingId });

    expect([400, 404]).toContain(response.status);
  });
});