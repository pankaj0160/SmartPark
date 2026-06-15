<div align="center">

# SmartPark

**Parking discovery and booking platform for India**

*Find · Book · Navigate · Pay — in one place*

<br/>

[![CI](https://github.com/pankaj0160/SmartPark/actions/workflows/ci.yml/badge.svg)](https://github.com/pankaj0160/SmartPark/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

[**Setup Guide**](#-quick-start) · [**API Reference**](#-api-reference) · [**AI Features**](#-ai-assistant) · [**Report Bug**](../../issues)

<br/>

<!-- ============================================================
  IMAGE 1: Hero banner or app logo
  What to put here: A clean banner image (1200×400px) showing the
  SmartPark logo or a screenshot of the map view with parking markers.
  How to add: Take a screenshot of the homepage map, upload it to
  GitHub issues (drag-drop into any issue text box), copy the URL,
  then paste:
  <img width="1200" alt="SmartPark hero" src="YOUR_URL_HERE" />
  ============================================================ -->

</div>

---

## Live Links

| | URL |
|---|---|
| **Frontend** | https://smart-park-client.vercel.app |
| **Backend API** | https://smartpark-1-sg1y.onrender.com/api/health |
| **Repository** | https://github.com/pankaj0160/SmartPark |

<!-- ============================================================
  IMAGE 2: App screenshots (2 side by side)
  What to put here: Two screenshots showing the main driver view.
  Recommended: (1) parking discovery map with results list,
  (2) booking modal or payment flow.
  How to add: Take screenshots, drag into a GitHub issue to get URLs,
  then paste both img tags below and delete this comment.

  <img width="900" alt="Parking discovery" src="YOUR_SCREENSHOT_1_URL" />
  <img width="900" alt="Booking flow" src="YOUR_SCREENSHOT_2_URL" />
  ============================================================ -->

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [AI Assistant](#-ai-assistant)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)

---

## Overview

SmartPark connects **drivers** who need parking with **owners** who have underused lots. It is built for the Indian market — IST timezone, Razorpay payments, ₹ pricing, Indian city geography.

```
  Driver                    SmartPark                        Owner
  ──────                    ─────────                        ─────
  Search nearby    ───►  Geo query ($geoNear)
  Get ranked list  ◄───  Weighted ranking (50/30/20)
  Book a slot      ───►  MongoDB ACID transaction    ───►  Booking notification
  Pay via Razorpay ───►  HMAC-SHA256 verification   ───►  Revenue dashboard
  Navigate to lot  ───►  OSRM turn-by-turn routing
  Chat with AI     ───►  Groq function calling
```

### User Roles

| Driver | Owner | Admin |
|:---:|:---:|:---:|
| Discover and book parking | List and manage lots | Verify listings |
| Real-time slot availability | Revenue analytics | Manage users |
| Turn-by-turn navigation | Booking notifications | Handle disputes |
| Pay via UPI / cards | Set pricing per vehicle type | Full platform oversight |
| AI-powered natural language search | Peak hour heatmap | — |

---

## Features

### Search and Discovery
- **Geo-spatial search** — `$geoNear` aggregation pipeline with 2dsphere index, configurable radius
- **Weighted ranking** — distance 50% + price 30% + availability 20%; lower score = better result
- **Smart badges** — Best Choice, Nearest, Best Price automatically assigned
- **Interactive map** — Leaflet with colour-coded markers and OSRM driving route overlay
- **Text search** — search by name, city, area, or amenity

### Booking Engine
- **Concurrency-safe** — MongoDB transactions with pessimistic document locking; exactly one booking succeeds when multiple requests compete for the last slot
- **Live availability** — slot counts computed from actual booking data on every request, never from a stale cache
- **IST-aware** — all date/time logic uses India Standard Time wall-clock semantics
- **30-minute lead time** — bookings must start at least 30 minutes from now
- **Unique booking codes** — generated with `crypto.randomBytes()`, format `BOOK-A9F3K2D1`

### Payments
- **Razorpay integration** — UPI, net banking, credit/debit cards, wallets
- **Webhook-first confirmation** — HMAC-SHA256 verified server callback is the authoritative payment signal; client callbacks are secondary
- **Timing-safe comparison** — `crypto.timingSafeEqual()` on webhook signatures prevents timing attacks
- **Coupon system** — percentage and flat-rate discounts with usage limits
- **Automated refunds** — cancellation triggers Razorpay refund API automatically

### AI Assistant
- **Groq** (model: `openai/gpt-oss-120b`) with function calling — understands natural language like *"covered parking near Bandra under ₹40/hr"*
- **Agentic tool loop** — model autonomously calls `searchParkings` and `checkAvailability` against live data
- **Inline result cards** — response renders real parking cards with prices, ratings, amenities, and a booking link
- **Multi-turn** — full conversation context maintained across messages

### Real-Time
- **Socket.IO broadcasts** — slot counts pushed to all connected clients the moment a booking is confirmed
- **Per-user targeting** — `userId → Set<socketId>` map supports multiple open tabs per user
- **Persistent notifications** — unread badge, read/unread state persisted to database

### Owner Dashboard
- Revenue trends over time (Recharts)
- Peak hour heatmap — busiest times per day of week
- Utilisation rate by vehicle type
- Booking volume and average duration

### Security (9 layers)
- JWT (HS256, 7-day expiry) + Google OAuth one-tap login
- Role-based access control enforced at middleware — 401 vs 403 distinction
- `express-mongo-sanitize` — strips `$` and `.` operators (NoSQL injection prevention)
- `xss-clean` — sanitises HTML/JS from request bodies (stored XSS prevention)
- `helmet` — sets 14 security HTTP headers (CSP, HSTS, X-Frame-Options)
- `bcrypt` cost factor 12 — password hashing
- Rate limiting — 5 req/min on auth routes, 100 req/min on all other routes
- `passwordHash` field has `select: false` — never included in query results
- `crypto.timingSafeEqual` on payment webhook signatures

---

## Tech Stack

### Backend

| Package | Version | Purpose |
|---|:---:|---|
| Node.js | 18+ | Runtime |
| Express | 5.x | HTTP framework — built-in async error propagation |
| MongoDB | 6+ | Primary database — native `$geoNear`, 2dsphere, transactions |
| Mongoose | 9.x | ODM — schema validation, compound indexes, middleware hooks |
| Socket.IO | 4.8 | Real-time slot updates |
| Razorpay | 2.9 | Payments — UPI, net banking, HMAC webhook |
| Cloudinary | 2.x | Image storage and CDN delivery |
| Zod | 4.x | Runtime request validation with per-field error paths |
| jsonwebtoken | 9.x | Stateless JWT authentication |
| openai | latest | OpenAI-compatible SDK pointed at Groq API (`api.groq.com/openai/v1`) |
| bcryptjs | 3.x | Password hashing, cost factor 12 |
| helmet | 8.x | 14 HTTP security headers in one call |

### Frontend

| Package | Version | Purpose |
|---|:---:|---|
| React | 19 | UI framework |
| Vite | 7.x | Build tool |
| React Router | 7.x | Nested layouts + role-gated routes |
| Tailwind CSS | 3.x | Styling — CSS variables for light/dark theme |
| Leaflet + React-Leaflet | 1.9 | Interactive map, no API key required |
| Recharts | 3.x | Owner analytics charts |
| Axios | 1.x | HTTP client with auth interceptors |
| Socket.IO-client | 4.8 | Real-time connection |
| @react-oauth/google | 0.12 | Google One Tap login |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT (React 19 SPA)                    │
│  AuthProvider │ BookingModal │ Leaflet Map │ AI Chat Widget  │
│  ─────────────────────────────────────────────────────────── │
│         Axios (apiClient.js) + Socket.IO (socket.js)        │
└──────────────────────────┬───────────────────────────────────┘
                           │  HTTP + WebSocket
┌──────────────────────────┼───────────────────────────────────┐
│                SERVER (Express 5 + Node.js)                  │
│  helmet · cors · mongo-sanitize · xss · rate-limit · morgan  │
│  ─────────────────────────────────────────────────────────── │
│  Routes → Controllers → Services → Models                    │
│                                                              │
│  booking.service    occupancy.service    parking.service     │
│  ACID tx + lock     overlap aggregation  $geoNear + ranking  │
│                                                              │
│  payment.service    chat.service         analytics.service   │
│  Razorpay + HMAC    Groq tool loop      revenue aggregation │
└──────┬───────────────────┬────────────────────┬─────────────┘
       ▼                   ▼                    ▼
  MongoDB Atlas       Razorpay API          Groq API
  (replica set)       (webhooks)            (Haiku)
```

### Key Design Decisions

| Decision | Why | Trade-off |
|---|---|---|
| MongoDB transactions | ACID guarantees on bookings — zero double-bookings | Requires replica set |
| Webhook-first payment | Server HMAC-SHA256 cannot be forged; client callbacks can | ~1–2s pending state in UI |
| Live availability (no cache) | Slot counts always accurate | More DB reads — mitigated by compound index |
| String dates `YYYY-MM-DD` | No UTC/IST conversion bugs | Manual string comparison for past-booking detection |
| Dependency injection in services | Every service testable with mock models, no test DB needed | Slightly more verbose function signatures |

---

## Project Structure

```
SmartPark/
├── .github/
│   └── workflows/
│       └── ci.yml                  ← GitHub Actions CI (runs on push + PR)
├── docker-compose.yml              ← Starts API + MongoDB with one command
├── .env.example                    ← Template for all environment variables
│
├── server/                         ← Node.js + Express 5 API
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js               ← Entry: DB → seed → HTTP → Socket.IO
│       ├── app.js                  ← Middleware stack + all route mounts
│       ├── config/
│       │   ├── db.js               ← MongoDB connection with retry
│       │   ├── env.js              ← Single source for all env vars
│       │   └── socket.js           ← Socket.IO singleton + userSocketMap
│       ├── middleware/
│       │   ├── authenticate.js     ← JWT verify + active-user check → req.user
│       │   ├── authorizeRoles.js   ← RBAC guard (driver | owner | admin)
│       │   ├── validateRequest.js  ← Generic Zod schema validator
│       │   ├── rateLimiter.js      ← apiLimiter (100/min) + authLimiter (5/min)
│       │   ├── uploadParkingImages.js ← Multer → Cloudinary pipeline
│       │   └── errorHandler.js     ← Central { success, message, errors[] } shape
│       ├── models/
│       │   ├── user.model.js
│       │   ├── parking.model.js    ← GeoJSON Point, 2dsphere index
│       │   ├── booking.model.js    ← Compound index for occupancy queries
│       │   ├── review.model.js     ← One review per booking (unique index)
│       │   └── notification.model.js
│       ├── services/
│       │   ├── booking.service.js  ← ACID transaction + pessimistic lock
│       │   ├── occupancy.service.js ← Interval-overlap aggregation
│       │   ├── parking.service.js  ← $geoNear pipeline + weighted ranking
│       │   ├── chat.service.js     ← Groq agentic tool loop
│       │   ├── payment.service.js  ← Razorpay order + HMAC webhook verify
│       │   ├── analytics.service.js ← Revenue and utilisation aggregations
│       │   ├── auth.service.js     ← Register, login, Google OAuth
│       │   └── notification.service.js
│       ├── controllers/            ← Validate → call service → send response
│       ├── routes/                 ← Route definitions + middleware chain
│       ├── validators/             ← Zod schemas per resource
│       └── utils/
│           ├── ranking.js          ← Pure weighted scoring (50/30/20 weights)
│           ├── codeGenerator.js    ← crypto.randomBytes() booking codes
│           ├── bookingValidation.js ← IST-aware business rules
│           └── asyncHandler.js
│
└── client/                         ← React 19 SPA (Vite)
    └── src/
        ├── features/
        │   ├── auth/               ← AuthProvider, useAuth, Google OAuth
        │   ├── bookings/           ← BookingModal, booking state
        │   ├── chat/               ← ChatWidget, ParkingResultCard, chatApi
        │   ├── map/                ← Leaflet map, OSRM routing, landmarks
        │   ├── parkings/           ← Discovery, filters, ParkingForm
        │   ├── notifications/      ← Bell badge, notification list
        │   ├── analytics/          ← Owner revenue charts (Recharts)
        │   ├── owner/              ← Owner lot management
        │   ├── admin/              ← Admin dashboard
        │   ├── reviews/            ← Rating stars, review form
        │   ├── profile/            ← Account settings, password change
        │   └── theme/              ← Light / dark / system theme toggle
        ├── lib/
        │   └── apiClient.js        ← Axios instance + auth token interceptor
        ├── services/
        │   └── socket.js           ← Socket.IO client singleton
        └── routes/
            └── router.jsx          ← React Router v7 + ProtectedRoute
```

---

## Quick Start

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **MongoDB** — [Atlas free tier](https://www.mongodb.com/atlas) (recommended) or local with `--replSet rs0`
- **Docker Desktop** *(optional)* — [docker.com](https://www.docker.com/products/docker-desktop/) — for one-command startup

### 1 · Clone

```bash
git clone https://github.com/pankaj0160/SmartPark.git
cd SmartPark
```

### 2 · Environment variables

```bash
cp .env.example server/.env
```

Edit `server/.env`. Minimum required to run:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartpark
JWT_SECRET=any_string_of_32_or_more_random_characters
```

Everything else (Cloudinary, Razorpay, Groq) can be added later — the app starts without them.

### 3 · Install

```bash
cd server && npm install
cd ../client && npm install
```

### 4 · Run

```bash
# Terminal 1 — API on port 5000
cd server && npm run dev

# Terminal 2 — React on port 5173
cd client && npm run dev
```

### 5 · Open

```
http://localhost:5173
```

The server seeds default parking data on first start. The AI chat widget is the blue bubble in the bottom-right corner — it only works if `GROQ_API_KEY` is set.

### Run with Docker (alternative)

```bash
# From the project root — starts API + MongoDB together
docker compose up

# Stop (keeps database data)
docker compose down
```

### Local MongoDB replica set (only needed if not using Atlas)

```bash
mongod --replSet rs0 --dbpath /your/db/path --bind_ip localhost
mongosh --eval "rs.initiate()"   # run once
```

---

## Environment Variables

### `server/.env`

```env
# App
NODE_ENV=development
PORT=5000

# Database (Atlas recommended — requires replica set for transactions)
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/smartpark

# Auth
JWT_SECRET=replace_with_32+_char_random_string
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# CORS
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173

# Cloudinary — https://cloudinary.com (optional — images fall back to URLs)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay — https://dashboard.razorpay.com (optional — use test mode keys)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
ALLOW_TEST_PAYMENT=true

# Groq AI — https://console.groq.com (optional — /api/chat returns 503 if missing)
GROQ_API_KEY=gsk_your_key_here
```

### `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/auth/register` | — | Register — email + password + role |
| `POST` | `/api/auth/login` | — | Login — returns `{ token, user }` |
| `POST` | `/api/auth/google` | — | Google OAuth via ID token |
| `GET` | `/api/auth/me` | Bearer | Current user |
| `PUT` | `/api/auth/password` | Bearer | Change password |

### Parkings

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `GET` | `/api/parkings` | Optional | All approved parkings, paginated |
| `GET` | `/api/parkings/nearby` | Optional | Radius search — `?lat&lng&radius` |
| `GET` | `/api/parkings/smart` | Optional | Weighted-ranked recommendations |
| `GET` | `/api/parkings/:id` | Optional | Detail + live slot count |
| `POST` | `/api/parkings` | Owner | Create listing |
| `PUT` | `/api/parkings/:id` | Owner | Update listing |
| `DELETE` | `/api/parkings/:id` | Owner | Delete listing |

### Bookings

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/bookings` | Driver | Create booking (ACID transaction) |
| `GET` | `/api/bookings/my-bookings` | Driver | Booking history |
| `GET` | `/api/bookings/:id` | Driver | Booking detail |
| `PATCH` | `/api/bookings/:id/cancel` | Driver | Cancel + trigger refund |

### Payments

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/payments/create-order` | Driver | Create Razorpay order |
| `POST` | `/api/payments/verify` | Driver | Client-side verification |
| `POST` | `/api/payments/webhook` | HMAC | Razorpay server callback (authoritative) |

### Other

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/api/chat` | AI parking assistant |
| `GET` | `/api/analytics/owner` | Owner revenue and utilisation stats |
| `POST` | `/api/reviews` | Submit review (one per booking) |
| `GET` | `/api/reviews/parking/:id` | Reviews for a parking lot |
| `GET` | `/api/notifications` | Notification list + unread count |
| `PUT` | `/api/notifications/:id/read` | Mark as read |
| `GET` | `/api/search?q=` | Full-text search |
| `GET` | `/api/health` | Server + DB health check |

---

## AI Assistant

The AI assistant uses **Groq** (model: `openai/gpt-oss-120b`) with function calling. It never invents parking data — it calls your live services.

<!-- ============================================================
  IMAGE 3: AI chat screenshot
  What to put here: A screenshot of the chat widget with a real
  conversation — e.g. user asking "covered parking near Bandra
  under ₹40/hr" and the assistant returning parking cards.
  How to add: Screenshot the chat panel, upload to GitHub issues,
  paste the URL below.

  <img width="600" alt="AI assistant demo" src="YOUR_URL_HERE" />
  ============================================================ -->

### How It Works

```
User: "covered parking near Andheri under ₹50/hr"
  │
  ▼  chat.service.js sends message + tool definitions to Groq
  │
  ▼  model returns: tool_use → searchParkings({ lat, lng, maxPrice: 50 })
  │
  ▼  executeTool() calls listSmartParkings() from parking.service.js
  │
  ▼  real MongoDB results returned to model
  │
  ▼  model generates: { type: "parking_results", results: [...] }
  │
  ▼  ChatWidget renders inline ParkingResultCard components
```

### Tools Available

| Tool | Maps To | Triggered When |
|---|---|---|
| `searchParkings(lat, lng, radiusKm, maxPrice, limit)` | `listSmartParkings()` | User asks to find parking |
| `checkAvailability(parkingId, date, startTime, endTime)` | `calculateAvailableSlots()` | User asks about a specific slot or time |

### Setup

```env
# server/.env
GROQ_API_KEY=gsk_your_key_here
```

Get a key at [console.groq.com](https://console.groq.com). If the key is missing, `/api/chat` returns `503` — all other routes are unaffected.

---

## Database Schema

```
User          _id, email (unique), role (driver|owner|admin), status (active|suspended)
              passwordHash (select:false), googleId (sparse index)

Parking       _id, owner → User, title, city, address, pincode, state
              location { type:"Point", coordinates:[lng,lat] }  ← 2dsphere index
              hourlyPrice, totalSlots, availableSlots, vehicleTypes[]
              verificationStatus (pending|approved|rejected)

Booking       _id, bookingCode (unique), user → User, parking → Parking
              bookingDate (YYYY-MM-DD), startTime (HH:mm), endTime (HH:mm)
              slotCount, totalAmount, status, paymentStatus, razorpayOrderId
              ↑ Compound index: (parking, bookingDate, status, startTime, endTime)

Review        _id, user → User, parking → Parking, booking → Booking (unique)
              rating (1–5), comment
              ↑ unique index on booking — one review per booking enforced at DB level

Notification  _id, userId → User, type, message, isRead (bool)
              ↑ Compound index: (userId, isRead, createdAt)
```

### Occupancy Query

The overlap detection query runs on every availability check:

```js
// Counts booked slots that overlap the requested time window
// Interval overlap condition: A.start < B.end AND A.end > B.start
Booking.aggregate([
  { $match: {
      parking: parkingId,
      bookingDate: requestedDate,
      paymentStatus: 'paid',
      status: { $ne: 'cancelled' },
      startTime: { $lt: requestedEndTime },
      endTime:   { $gt: requestedStartTime }
  }},
  { $group: { _id: null, totalSlots: { $sum: '$slotCount' } } }
])
// availableSlots = parking.totalSlots - result.totalSlots
```

The compound index on `(parking, bookingDate, status, startTime, endTime)` makes this an index scan regardless of booking history size.

---

## Testing

Tests use **Jest + Supertest** against a dedicated test database. The full suite runs automatically on every push via GitHub Actions.

```bash
cd server

# Run all integration tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode during development
npm run test:watch
```

### Test Suites

| File | What It Covers |
|---|---|
| `tests/integration/api.integration.test.js` | `GET /parkings`, `POST /bookings`, `POST /payments` — status codes, response shape, auth guards |
| `tests/integration/auth.integration.test.js` | Register, login, duplicate email, weak password, RBAC (401 vs 403) |

### What Is Tested

- ✅ Happy paths — register, login, parking listing
- ✅ Auth guards — 401 on missing token, 401 on tampered JWT
- ✅ RBAC — driver gets 403 (not 401) on admin routes
- ✅ Validation — invalid email and weak password return structured `errors[]` array
- ✅ Duplicate handling — 409 on already-registered email
- ✅ Response shape — all endpoints return `{ success, data }` or `{ success, message, errors[] }`

### Test Setup

Each run:
1. Connects to `smartpark_test` — never touches production data
2. `beforeEach` wipes all collections — every test starts clean
3. `afterAll` disconnects and drops the test database

JWT tokens in tests are signed with the same `JWT_SECRET` and same `{ subject: user._id }` payload format that `authenticate` middleware expects — so auth behaviour is identical to production.

CI badge at the top of this README shows the current test status.

---

## Deployment

### Recommended Stack

| Layer | Provider |
|---|---|
| Database | MongoDB Atlas M10+ (replica set required for transactions) |
| API | Railway / Render / AWS EC2 |
| Frontend | Vercel / Netlify |
| Images | Cloudinary (already integrated) |

### Production Environment

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...   # Atlas connection string
JWT_SECRET=<64-char random string>
ALLOW_TEST_PAYMENT=false        # switch to live Razorpay keys
```

### Docker

```bash
# Start API + MongoDB (from project root)
docker compose up

# Background
docker compose up -d

# Stop (data is preserved in named volume)
docker compose down

# Wipe everything including data
docker compose down -v

# Follow API logs
docker compose logs -f api
```

| Container | Image | Port |
|---|---|---|
| `smartpark-api` | Built from `server/Dockerfile` (Node 20 Alpine) | 5000 |
| `smartpark-mongo` | `mongo:6` | 27017 |

The API waits for MongoDB's health check before starting (`depends_on: condition: service_healthy`).

### Multi-Instance Socket.IO (Redis adapter)

When running multiple API instances, add Redis so Socket.IO events are shared across instances:

```bash
npm install @socket.io/redis-adapter ioredis
```

```js
// server/src/config/socket.js
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'ioredis';
const pub = createClient({ url: process.env.REDIS_URL });
const sub = pub.duplicate();
io.adapter(createAdapter(pub, sub));
```

---

## Roadmap

### Completed

- [x] Concurrency-safe booking with MongoDB ACID transactions
- [x] Razorpay integration with webhook-first payment confirmation
- [x] Real-time slot updates via Socket.IO
- [x] AI parking assistant (Groq `openai/gpt-oss-120b` with function calling)
- [x] Google OAuth + JWT authentication
- [x] Owner analytics dashboard
- [x] Role-based access control (3 roles)
- [x] Interactive Leaflet map with OSRM turn-by-turn routing
- [x] Light / dark / system theme toggle
- [x] Jest + Supertest integration test suite (16 tests)
- [x] GitHub Actions CI pipeline
- [x] Docker Compose local development setup

### Planned

- [ ] Redis-backed rate limiting (replaces in-memory, works across instances)
- [ ] Swagger / OpenAPI documentation auto-generated from routes
- [ ] SMS booking confirmation (Twilio or MSG91)
- [ ] EV charging filter in parking search
- [ ] Monthly subscription plans for reserved spots
- [ ] React Native mobile app

---

## Contributing

```bash
git checkout -b feat/your-feature-name
# make changes and add tests
git commit -m "feat: describe what you added"
git push origin feat/your-feature-name
# open a Pull Request
```

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code restructure without behaviour change |
| `test:` | Adding or updating tests |
| `ci:` | CI / workflow changes |

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

Built for India's urban parking problem 🇮🇳

[![GitHub stars](https://img.shields.io/github/stars/pankaj0160/SmartPark?style=social)](https://github.com/pankaj0160/SmartPark/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/pankaj0160/SmartPark?style=social)](https://github.com/pankaj0160/SmartPark/network/members)
[![GitHub issues](https://img.shields.io/github/issues/pankaj0160/SmartPark?style=social)](https://github.com/pankaj0160/SmartPark/issues)

</div>