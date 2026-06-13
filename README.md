

```
# SMARTPARK
```

### Intelligent Parking Discovery & Booking Platform for India

*Find · Book · Navigate · Pay — all in one place*

<br/>

# SmartPark

[![CI](https://github.com/pankaj0160/SmartPark/actions/workflows/ci.yml/badge.svg)](https://github.com/pankaj0160/SmartPark/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com)
[![Claude AI](https://img.shields.io/badge/Claude_AI-Assistant-CC785C?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

[**📖 Setup Guide**](#-quick-start) · [**🔌 API Reference**](#-api-reference) · [**🤖 AI Features**](#-ai-assistant) · [**🐛 Report Bug**](../../issues)

<br/>

</div>



---

# 🌐 Live Project

### Frontend
https://smart-park-client.vercel.app

### Backend API
https://smartpark-1-sg1y.onrender.com

### GitHub Repository
https://github.com/pankaj0160/SmartPark


<img width="1838" height="906" alt="image" src="https://github.com/user-attachments/assets/f9ddfac6-6b03-468a-9fbd-8fe298012c9b" />
<img width="1808" height="918" alt="image" src="https://github.com/user-attachments/assets/1360a53f-bdd1-4c0d-94ff-4cf80b8dbfe8" />

---

<div align="center">

<br/>


---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#️-environment-variables)
- [🔌 API Reference](#-api-reference)
- [🤖 AI Assistant](#-ai-assistant)
- [🗃️ Database Schema](#️-database-schema)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🗺️ Roadmap](#️-roadmap)

---

## 🌟 Overview

**SmartPark** solves one of urban India's daily frustrations — wasted time circling for parking with zero information about availability, pricing, or distance. It connects **drivers** who need parking with **owners** who have underutilised lots, through a real-time platform built specifically for the Indian market (IST timezone, Razorpay payments, ₹ pricing, Indian city geography).

```
                        ┌─────────────────────────────┐
  🚗 Driver             │         SmartPark            │          🏢 Owner
  ─────────             │                              │          ───────
  Search nearby    ───► │  Geo query ($geoNear)        │
  Get ranked list  ◄─── │  AI ranking (50/30/20)       │
  Book a slot      ───► │  ACID transaction + lock     │ ───► Booking notification
  Pay via Razorpay ───► │  Webhook HMAC verification   │ ───► Revenue analytics
  Navigate to lot  ───► │  OSRM turn-by-turn routing   │
  Chat with AI     ───► │  Claude Haiku function call  │
                        └─────────────────────────────┘
```

### Who Is It For?

| 🚗 Driver | 🏢 Owner | 👑 Admin |
|:---:|:---:|:---:|
| Discover & book parking | List and manage lots | Verify listings |
| Real-time slot counts | Revenue dashboard | Manage users |
| Turn-by-turn navigation | Booking notifications | Oversee platform |
| Pay via UPI / cards | Set pricing per vehicle | Handle disputes |
| AI-powered search | Analytics & peak hours | Full oversight |

---

## ✨ Features

### 🔍 Smart Discovery
- **Geo-spatial search** — MongoDB `$geoNear` pipeline with 2dsphere index finds parking within a configurable radius
- **AI ranking algorithm** — weighted scoring: distance (50%) + price (30%) + availability (20%) — lower score = better result
- **Smart badges** — top result gets *Best Choice*, closest gets *Nearest*, cheapest gets *Best Price*
- **Interactive Leaflet map** — real-time markers, colour-coded by badge, with route drawing
- **Text search** — search by parking name, city, area, or amenities

### 📅 Booking Engine
- **Concurrency-safe bookings** — MongoDB transactions with pessimistic document locking prevent any double-bookings
- **Live availability** — slot counts computed from real booking data on every request — never a stale cache
- **IST-aware logic** — all date/time operations use India Standard Time wall-clock semantics (no UTC conversion bugs)
- **30-minute lead time** — bookings must start at least 30 minutes in the future
- **Booking codes** — cryptographically secure unique codes (`BOOK-A9F3K2D1`) via `crypto.randomBytes()`

### 💳 Payment System
- **Razorpay integration** — UPI, net banking, credit/debit cards, wallets
- **Webhook-first confirmation** — HMAC-SHA256 verified server callback is the authoritative payment signal
- **Timing-safe comparison** — `crypto.timingSafeEqual()` prevents timing attacks on webhook signatures
- **Coupon system** — percentage and flat-rate discounts with usage limits
- **Automated refund flow** — cancellation triggers the Razorpay refund API

### 🤖 AI Assistant *(New)*
- **Claude Haiku** with LLM function calling — understands natural language like *"covered parking near Bandra under ₹40/hr"*
- **Agentic tool loop** — model autonomously calls `searchParkings` and `checkAvailability` tools against your live data
- **Inline result cards** — AI response renders real parking cards with prices, ratings, amenities, and booking links
- **Multi-turn conversation** — full session context maintained across the conversation

### 📡 Real-Time Events
- **Socket.io broadcasts** — slot availability updates sent to all connected clients the moment a booking is created
- **Per-user targeting** — `userId → Set<socketId>` map supports targeted notifications even across multiple tabs
- **Persistent notifications** — bell badge with unread count, read/unread state saved to DB

### 📊 Analytics (Owner Dashboard)
- Revenue trends over time with Recharts
- Peak hour heatmap — see when your lot is busiest
- Utilisation rate by vehicle type
- Booking volume and average duration

### 🔐 Security (8 Layers)
- JWT (HS256, 7-day expiry) + Google OAuth one-tap login
- Role-based access control — driver / owner / admin enforced at middleware level
- `express-mongo-sanitize` — strips `$`, `.` operators from inputs (NoSQL injection prevention)
- `xss-clean` — sanitises HTML/JS from request bodies (stored XSS prevention)
- `helmet` — sets 14 security-related HTTP headers (CSP, HSTS, X-Frame-Options…)
- `bcrypt` (12 rounds) — industry-standard password hashing
- Rate limiting — 100 req/min on API, 5 req/min on auth endpoints
- `passwordHash` field has `select: false` — never leaks in queries

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Why It Was Chosen |
|---|:---:|---|
| **Node.js** | 18+ | Async I/O matches search workload; large ecosystem |
| **Express** | 5.x | Built-in async error propagation — no try/catch wrappers per route |
| **MongoDB** | 6+ | Native `$geoNear` + 2dsphere; flexible schema for variable listing fields |
| **Mongoose** | 9.x | Schema validation, middleware hooks, compound index definitions |
| **Socket.io** | 4.8 | Shares same HTTP port; room-free targeted emit via `userSocketMap` |
| **Razorpay** | 2.9 | India's leading gateway — UPI, net banking, HMAC webhook |
| **Cloudinary** | 2.x | Auto-transformation CDN; no files touch the server disk |
| **Zod** | 4.x | Runtime schema validation with per-field error paths |
| **JWT** | 9.x | Stateless auth — no session store needed at current scale |
| **@anthropic-ai/sdk** | latest | Claude Haiku function calling for the AI assistant |
| **bcryptjs** | 3.x | 12-round bcrypt — production-standard password hashing |
| **helmet** | 8.x | One-line, 14 HTTP security headers |

### Frontend

| Technology | Version | Why It Was Chosen |
|---|:---:|---|
| **React** | 19 | Concurrent features reduce booking UI jank |
| **Vite** | 7.x | Sub-second HMR; ES module-native build |
| **React Router** | 7.x | Nested layouts + role-gated sub-routes |
| **Tailwind CSS** | 3.x | Utility-first; CSS variables power light/dark theming |
| **Leaflet + React-Leaflet** | 1.9 | Open-source, no API key; excellent GeoJSON support |
| **Recharts** | 3.x | Composable chart primitives for owner analytics |
| **Axios** | 1.x | Interceptors for auth headers; consistent error shape |
| **Socket.io-client** | 4.8 | Matches server version; auto-reconnect |
| **Lucide React** | 0.55 | Tree-shakeable icon library |
| **@react-oauth/google** | 0.12 | Google One Tap login |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT  (React 19 SPA)                         │
│  ┌────────────┐  ┌───────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │AuthProvider│  │ Bookings  │  │  Leaflet │  │   AI Chat Widget      │ │
│  │useAuth()   │  │  Modal    │  │   Map    │  │  Claude Haiku + Tools │ │
│  └─────┬──────┘  └─────┬─────┘  └─────┬────┘  └──────────┬────────────┘ │
│  ┌─────┴───────────────┴──────────────┴────────────────────┴───────────┐ │
│  │           apiClient.js (Axios)        socket.js (Socket.io)         │ │
│  └──────────────────────────────┬────────────────────────────────────--┘ │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │  HTTP REST + WebSocket
┌─────────────────────────────────┼───────────────────────────────────────┐
│                      SERVER  (Node.js + Express 5)                       │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │  helmet · cors · morgan · mongo-sanitize · xss · rate-limiter    │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│  Routes → Controllers → Services → Models                                │
│  ┌──────────────────┐  ┌───────────────────┐  ┌───────────────────┐     │
│  │  booking.service │  │ occupancy.service  │  │  parking.service  │     │
│  │  ACID tx + lock  │  │  overlap agg.      │  │  ranking algo     │     │
│  └──────────────────┘  └───────────────────┘  └───────────────────┘     │
│  ┌──────────────────┐  ┌───────────────────┐  ┌───────────────────┐     │
│  │  payment.service │  │  chat.service      │  │ analytics.service │     │
│  │  Razorpay+HMAC   │  │  LLM agent loop   │  │  revenue agg.     │     │
│  └──────────────────┘  └───────────────────┘  └───────────────────┘     │
└──────────────────────────────────┬──────────────────────────────────────┘
              ┌─────────────────────┼──────────────────┐
              ▼                     ▼                   ▼
         ┌─────────┐         ┌──────────────┐   ┌──────────────┐
         │ MongoDB │         │   Razorpay   │   │  Claude AI   │
         │  Atlas  │         │   Webhooks   │   │   (Haiku)    │
         └─────────┘         └──────────────┘   └──────────────┘
```

### Key Architectural Decisions

| Decision | Rationale | Trade-off |
|---|---|---|
| **MongoDB transactions** | ACID guarantees — zero double-bookings under concurrent load | Requires replica set |
| **Webhook-first payment** | Server HMAC-SHA256 can't be faked; client callbacks can | ~1–2s pending state in UI |
| **Live availability** | Slot counts always accurate — no stale data | More DB reads (mitigated by compound index) |
| **String dates (YYYY-MM-DD)** | No timezone bugs — all logic in IST wall-clock | Manual string comparison for past-booking detection |
| **Dependency injection** | Every service testable with mock models — no test DB | Slightly more verbose function signatures |

---

## 📁 Project Structure

```
SmartPark/
├── README.md
├── SETUP.md                           ← Quick start guide
├── .env.example                       ← Template for all env vars
│
├── server/                            ← Node.js + Express 5 API
│   ├── package.json                   ← includes @anthropic-ai/sdk
│   └── src/
│       ├── server.js                  ← Entry: DB → seed → HTTP → Socket.io
│       ├── app.js                     ← Middleware stack + all route mounts
│       ├── config/
│       │   ├── db.js                  ← MongoDB connection with retry
│       │   ├── env.js                 ← Single source for all env vars
│       │   └── socket.js             ← Socket.io singleton + userSocketMap
│       ├── middleware/
│       │   ├── authenticate.js        ← JWT verify + active user → req.user
│       │   ├── authorizeRoles.js      ← RBAC guard (driver|owner|admin)
│       │   ├── validateRequest.js     ← Generic Zod schema validator
│       │   ├── rateLimiter.js         ← apiLimiter + authLimiter
│       │   ├── uploadParkingImages.js ← Multer → Cloudinary pipeline
│       │   └── errorHandler.js        ← Central { success, message, errors[] }
│       ├── models/
│       │   ├── user.model.js
│       │   ├── parking.model.js       ← GeoJSON Point, pricing Map
│       │   ├── booking.model.js       ← Compound index for occupancy queries
│       │   ├── review.model.js
│       │   └── notification.model.js
│       ├── services/
│       │   ├── booking.service.js     ⭐ ACID tx + pessimistic lock
│       │   ├── occupancy.service.js   ⭐ Interval-overlap aggregation
│       │   ├── parking.service.js     ← $geoNear + smart ranking
│       │   ├── chat.service.js        🤖 LLM agent loop
│       │   ├── payment.service.js     ← Razorpay + HMAC webhook
│       │   ├── analytics.service.js   ← Revenue + utilisation aggregations
│       │   ├── auth.service.js        ← Register, login, Google OAuth
│       │   └── notification.service.js
│       ├── controllers/               ← validate → service → respond
│       ├── routes/                    ← Route + middleware chain
│       ├── validators/                ← Zod schemas per resource
│       └── utils/
│           ├── ranking.js             ← Pure weighted scoring (50/30/20)
│           ├── codeGenerator.js       ← crypto.randomBytes() booking codes
│           ├── bookingValidation.js   ← IST-aware business rules
│           └── asyncHandler.js
│
└── client/                            ← React 19 SPA (Vite)
    └── src/
        ├── app/
        │   ├── AppLayout.jsx          ← Global header + ChatWidget mount
        │   ├── RoleWorkspaceLayout.jsx
        │   └── navigation.js
        ├── features/
        │   ├── auth/                  ← AuthProvider, useAuth, Google OAuth
        │   ├── bookings/              ← BookingModal, bookingIntent
        │   ├── chat/                  🤖 ChatWidget, ParkingResultCard, chatApi
        │   ├── map/                   ← Leaflet, OSRM routing, landmarks
        │   ├── parkings/              ← Discovery, filters, ParkingForm
        │   ├── notifications/         ← Bell badge, notification list
        │   ├── analytics/             ← Owner revenue charts
        │   ├── owner/                 ← Owner parking management
        │   ├── admin/                 ← Admin dashboard
        │   ├── reviews/               ← Rating stars, review forms
        │   └── theme/                 ← Light/dark CSS variables
        ├── lib/
        │   └── apiClient.js           ← Axios + auth token management
        ├── services/
        │   └── socket.js              ← Socket.io client singleton
        └── routes/
            └── router.jsx             ← React Router v7 + ProtectedRoute
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** → [nodejs.org](https://nodejs.org)
- **MongoDB** → [Atlas free tier](https://www.mongodb.com/atlas) *(recommended)* or local with replica set
- **Docker Desktop** *(optional)* → [docker.com](https://www.docker.com/products/docker-desktop/) — for `docker compose up` one-command startup

> **`uv` (Python installer)** — listed for future Python AI microservices (demand forecasting). Current project is Node.js only. Install from [astral.sh/uv](https://github.com/astral-sh/uv) when adding Python features.

### 1 · Clone

```bash
git clone https://github.com/pankaj0160/SmartPark.git
cd SmartPark
```

### 2 · Environment Variables

```bash
cp .env.example server/.env
cp .env.example client/.env
```

Edit `server/.env` with your values. Minimum required to start:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartpark
JWT_SECRET=any_long_random_string_here
```

Everything else (Cloudinary, Razorpay, AI) can be added later — the app runs without them.

### 3 · Install

```bash
cd server && npm install
cd ../client && npm install
```

### 4 · Run

```bash
# Terminal 1 — API (port 5000)
cd server && npm run dev

# Terminal 2 — React (port 5173)
cd client && npm run dev
```

### 5 · Open

```
http://localhost:5173
```

The server auto-seeds default parking lots on first start. Look for the **🔵 blue chat bubble** bottom-right — that's the AI assistant.

### Local MongoDB Replica Set *(skip if using Atlas)*

```bash
mongod --replSet rs0 --dbpath /your/db/path --bind_ip localhost
mongosh --eval "rs.initiate()"   # run once
```

---

## ⚙️ Environment Variables

### `server/.env`

```env
# App
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/smartpark

# Auth
JWT_SECRET=replace_with_32+_char_random_string
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# CORS
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173

# Cloudinary — https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=smartpark/parkings

# Razorpay — https://dashboard.razorpay.com
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
ALLOW_TEST_PAYMENT=true
TEST_COUPON_CODE=FREE100

# AI Assistant — https://console.anthropic.com
# Optional: if missing, /api/chat returns 503, all other routes unaffected
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

### `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_DEBUG_API=false
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/auth/register` | — | Register with email + password + role |
| `POST` | `/api/auth/login` | — | Login → returns `{ token, user }` |
| `POST` | `/api/auth/google` | — | Google OAuth via ID token |
| `GET` | `/api/auth/me` | 🔒 Bearer | Get current user |
| `PUT` | `/api/auth/password` | 🔒 Bearer | Change password |

### Parkings

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `GET` | `/api/parkings` | Optional | List all approved parkings (paginated) |
| `GET` | `/api/parkings/nearby` | Optional | Geo search: `?lat&lng&radius` |
| `GET` | `/api/parkings/smart` | Optional | AI-ranked recommendations |
| `GET` | `/api/parkings/:id` | Optional | Detail + live slot availability |
| `POST` | `/api/parkings` | 🔒 Owner | Create listing |
| `PUT` | `/api/parkings/:id` | 🔒 Owner | Update listing |
| `DELETE` | `/api/parkings/:id` | 🔒 Owner | Delete listing |

### Bookings

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/bookings` | 🔒 Driver | Create booking (ACID + lock) |
| `GET` | `/api/bookings/my` | 🔒 Driver | My booking history |
| `GET` | `/api/bookings/:id` | 🔒 Driver | Booking detail |
| `PUT` | `/api/bookings/:id/cancel` | 🔒 Driver | Cancel + trigger refund |

### Payments

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/payments/orders` | 🔒 Driver | Create Razorpay order |
| `POST` | `/api/payments/verify` | 🔒 Driver | Client-side verification |
| `POST` | `/api/payments/webhook` | HMAC | Razorpay server callback (authoritative) |

### AI Chat

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/chat` | Optional | Natural language parking assistant |

```json
// Request
{ "messages": [{ "role": "user", "content": "Find covered parking near Bandra under ₹40/hr" }] }

// Response — parking results
{ "success": true, "data": { "type": "parking_results", "message": "Found 3 options...", "results": [...] } }

// Response — availability
{ "success": true, "data": { "type": "availability", "message": "4 slots free.", "available": 4 } }
```

### Other Endpoints

```
GET    /api/analytics/owner           Owner revenue + utilisation stats
GET    /api/reviews/parking/:id       Reviews for a parking lot
POST   /api/reviews                   Submit post-visit review
GET    /api/notifications             Notification list + unread count
PUT    /api/notifications/:id/read    Mark as read
GET    /api/search?q=                 Full-text search
GET    /api/health                    Server + DB health check
```

---

## 🤖 AI Assistant

The AI assistant uses **Claude Haiku** with Anthropic's function calling API. It never makes up parking data — it calls your real services.

### How It Works

```
User: "find covered parking near Andheri under ₹50/hr"
  │
  ▼  chat.service.js sends message + tool definitions to Claude Haiku
  │
  ▼  model returns: tool_use → searchParkings({ lat, lng, ... })
  │
  ▼  executeTool() calls listSmartParkings() from parking.service.js
  │
  ▼  real MongoDB results fed back to model
  │
  ▼  model generates: { type: "parking_results", message: "...", results: [...] }
  │
  ▼  ChatWidget renders inline ParkingResultCard components
```

### Tools

| Tool | Maps To | When Used |
|---|---|---|
| `searchParkings(lat, lng, radiusKm, limit)` | `listSmartParkings()` | User asks to find parking |
| `checkAvailability(parkingId, date, startTime, endTime)` | `calculateAvailableSlots()` | User asks about a specific time |

### Setup

```bash
# Already in package.json — just install
cd server && npm install

# Add to server/.env
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

Get a free key at [console.anthropic.com](https://console.anthropic.com).

> If `ANTHROPIC_API_KEY` is missing, `/api/chat` returns `503`. All other routes work normally.

---

## 🗃️ Database Schema

```
User          _id, email (unique), role (driver|owner|admin), status
              passwordHash (select:false), googleId (sparse)

Parking       _id, owner → User, title, city, area
              location { type:"Point", coordinates:[lng,lat] }  ← 2dsphere index
              hourlyPrice, pricing (Map), amenities[], vehicleTypes[], totalSlots

Booking       _id, bookingCode (unique), user → User, parking → Parking
              bookingDate (YYYY-MM-DD), startTime (HH:mm), endTime (HH:mm)
              slotCount, totalAmount, status, paymentStatus, razorpayOrderId
              ↑ Compound index: (parking, bookingDate, status, startTime, endTime)

Review        _id, user, parking, booking (unique), rating (1-5), comment

Notification  _id, userId → User, type, message, isRead
              ↑ Compound index: (userId, isRead, createdAt)
```

### Critical Occupancy Query

```javascript
// Counts booked slots overlapping the requested time window
// Interval overlap: A.start < B.end  AND  A.end > B.start
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

The compound index makes this O(log n) regardless of booking history size.

---

## 🧪 Testing

The test suite uses **Jest + Supertest** with a dedicated test database.
Tests run automatically on every push via GitHub Actions CI.

​```bash
cd server

# Run all integration tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode during development
npm run test:watch
​```

### Test Suites

| Suite | File | What It Covers |
|---|---|---|
| **API Integration** | `tests/integration/api.integration.test.js` | `GET /parkings`, `POST /bookings`, `POST /payments` — status codes, response shape, auth guards |
| **Auth Integration** | `tests/integration/auth.integration.test.js` | Register, login, duplicate email, weak password, JWT validation, RBAC (401 vs 403) |

### What's Tested

- ✅ Happy paths — successful register, login, parking listing
- ✅ Auth guards — 401 on missing token, 401 on tampered JWT
- ✅ RBAC — driver gets 403 on admin routes, not 401
- ✅ Validation — invalid email, weak password return structured `errors[]` array
- ✅ Duplicate handling — 409 on already-registered email
- ✅ Response shape — all endpoints return `{ success, data }` or `{ success, message, errors[] }`

### Test Setup

Each test run:
1. Connects to a **dedicated test database** (`smartpark_test`) — never touches production data
2. `beforeEach` wipes all collections — every test starts from a clean slate
3. `afterAll` disconnects and drops the test database

JWT tokens in tests are signed with the same `JWT_SECRET` using the same
`{ subject: user._id }` payload format your `authenticate` middleware expects —
so auth middleware behaviour is identical to production.

### CI

Tests run automatically on GitHub Actions on every push and pull request to `main`.
See the CI badge at the top of this README for current status.

---

## 🚢 Deployment

### Production `.env`

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...atlas...  # replica set required
JWT_SECRET=<64-char cryptographically random string>
ALLOW_TEST_PAYMENT=false               # switch to live Razorpay keys
```

### Recommended Stack

| Layer | Provider |
|---|---|
| Database | MongoDB Atlas M10+ |
| API Server | Railway / Render / AWS EC2 |
| Frontend | Vercel / Netlify |
| Images | Cloudinary (already integrated) |

### Docker

The backend ships with a production `Dockerfile` and a `docker-compose.yml`
that starts the full stack (API + MongoDB) with a single command.

**Start everything locally:**

​```bash
# From the project root
docker compose up

# Or run in background
docker compose up -d

# Stop everything (keeps database data)
docker compose down

# Follow logs
docker compose logs -f api
​```

**What `docker compose up` starts:**

| Container | Image | Port | Purpose |
|---|---|---|---|
| `smartpark-api` | Built from `server/Dockerfile` | `5000` | Express API |
| `smartpark-mongo` | `mongo:6` | `27017` | MongoDB with health check |

The API container waits for MongoDB's health check to pass before starting
(`depends_on: condition: service_healthy`). MongoDB data is persisted in a
named Docker volume — `docker compose down` does not wipe your data.

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

> **Note:** The Docker setup uses a local MongoDB container. For production,
> replace `MONGODB_URI` in `docker-compose.yml` with your Atlas connection string.


### Multi-Instance Socket.io (Redis Adapter)

```bash
npm install @socket.io/redis-adapter ioredis
```

```javascript
// server/src/config/socket.js
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'ioredis';
const pub = createClient({ url: process.env.REDIS_URL });
const sub = pub.duplicate();
io.adapter(createAdapter(pub, sub));
```

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Concurrency-safe booking with ACID transactions
- [x] Razorpay integration with webhook-first confirmation
- [x] Real-time slot availability via Socket.io
- [x] AI parking assistant (Claude Haiku + function calling)
- [x] Google OAuth + JWT authentication
- [x] Owner analytics dashboard with Recharts
- [x] Role-based access control
- [x] Interactive Leaflet map with OSRM routing

### 🔄 Planned
- [ ] **Demand Forecasting** — Prophet/LSTM model for peak hour prediction + dynamic pricing
- [ ] **Semantic Search (RAG)** — Pinecone vector embeddings for intent-based search
- [ ] **Computer Vision** — Auto-tag parking amenities from uploaded images
- [ ] **SMS Notifications** — Twilio/MSG91 OTP + booking confirmation
- [ ] **EV Charging Filter** — Dedicated filter for EV-compatible spots
- [ ] **Monthly Subscriptions** — Reserved spot plans for regular commuters
- [ ] **React Native App** — Mobile app on the same backend

---

## 🤝 Contributing

```bash
git checkout -b feat/your-feature-name
# make changes + add tests
git commit -m "feat: add your feature"
git push origin feat/your-feature-name
# open a Pull Request
```

| Prefix | Use For |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `refactor:` | Restructure without behaviour change |
| `test:` | Adding/updating tests |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

<br/>

**Built for India's urban parking problem 🇮🇳**

*SmartPark — Every search, smarter.*

<br/>

⭐ **Star this repo** if you found it useful!

<br/>

[![GitHub stars](https://img.shields.io/github/stars/pankaj0160/SmartPark?style=social)](https://github.com/pankaj0160/SmartPark/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/pankaj0160/SmartPark?style=social)](https://github.com/pankaj0160/SmartPark/network/members)
[![GitHub issues](https://img.shields.io/github/issues/pankaj0160/SmartPark?style=social)](https://github.com/pankaj0160/SmartPark/issues)

</div>

<div align="center">

### Built with passion for solving real-world parking challenges 🚗

</div>
