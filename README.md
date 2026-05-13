# 🚗 SmartPark — Intelligent Smart Parking Management Platform

<div align="center">

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/API-Express-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-blue?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Frontend%20Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Backend%20Deploy-Render-purple?style=for-the-badge)

### Smart Parking Slot Rental & Availability Platform

A full-stack intelligent parking reservation platform that helps users discover, reserve, and manage parking spaces efficiently.

</div>

---

# 🌐 Live Project

### Frontend
https://smart-park-client.vercel.app

### Backend API
https://smartpark-1-sg1y.onrender.com

### GitHub Repository
https://github.com/pankaj0160/SmartPark

---

# 📌 Problem Statement

Urban parking management is inefficient, frustrating, and often chaotic.

Common real-world problems include:

- Drivers wasting time searching for parking
- Manual parking allocation systems
- Overbooking and reservation conflicts
- Lack of centralized parking discovery
- Poor occupancy visibility
- No structured owner-side management
- Revenue tracking difficulties
- Limited real-time monitoring

SmartPark solves these challenges through a centralized intelligent digital parking ecosystem.

---

# 🎯 Project Objectives

SmartPark is designed to:

- simplify parking discovery
- enable secure online parking reservations
- prevent slot overbooking
- provide owner dashboard management
- deliver platform-wide administrative control
- support payment-enabled booking workflows
- provide analytics-driven decision making
- improve parking space utilization

---

# ✨ Core Features

# 👤 Driver / User Features

- User registration & secure authentication
- Email/password login
- Google authentication
- Role-based access
- Discover parking spaces
- Search by location
- Smart filtering
- Parking details page
- Time-based reservation booking
- Multi-slot reservation support
- Razorpay payment integration
- Booking confirmation
- Booking cancellation
- Booking history
- Spending analytics
- Notification center
- Responsive UI experience

---

# 🏢 Parking Owner Features

- Owner authentication
- Dedicated owner dashboard
- Add parking spaces
- Edit parking details
- Delete parking listings
- Manage reservations
- Occupancy monitoring
- Available slot tracking
- Reserved slot tracking
- Booking completion management
- Revenue analytics
- Earnings dashboard
- Booking performance insights
- Notification management

---

# 🛡️ Admin Features

- Admin authentication
- Centralized admin dashboard
- User management
- Parking owner management
- Parking approval/moderation
- Booking oversight
- Platform analytics
- Occupancy monitoring
- Revenue insights
- Notification monitoring
- System-level visibility

---

# 🧠 Business Logic Highlights

## Smart Slot Availability Logic

SmartPark prevents inaccurate slot counts using reservation-aware occupancy tracking.

Formula:

```text
Available Slots = Total Slots - Active Reserved Slots
```

Included reservations:

✅ confirmed bookings  
✅ active reservations  
✅ ongoing bookings

Excluded reservations:

❌ cancelled bookings  
❌ completed bookings  
❌ failed payments  
❌ expired bookings  
❌ refunded bookings

---

## Booking Lifecycle

```text
User selects parking
      ↓
Chooses date/time
      ↓
Creates reservation
      ↓
Payment initiated
      ↓
Payment verification
      ↓
Booking confirmed
      ↓
Active reservation
      ↓
Completed / Cancelled
```

---

## Revenue Rules

### Driver Spending Includes

✅ successful paid bookings

### Driver Spending Excludes

❌ cancelled bookings  
❌ failed payments  
❌ expired reservations  

---

### Owner Earnings Include

✅ completed successful bookings

### Owner Earnings Exclude

❌ cancelled bookings  
❌ pending bookings  
❌ failed payments  

---

# 🏗️ System Architecture

```text
Frontend (React + Tailwind)
        ↓
REST API Layer (Express.js)
        ↓
Business Logic Layer
        ↓
MongoDB Database
        ↓
External Integrations
   ├── Razorpay Payments
   ├── Google Authentication
   └── Notification System
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Chart libraries
- Toast notifications

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Authentication & Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- Helmet
- Rate Limiting
- XSS Protection
- Mongo Sanitization
- Secure CORS Configuration

---

## Payments

- Razorpay Payment Gateway
- Payment verification workflow
- Transaction synchronization

---

## Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- MongoDB Atlas

---

# 👥 Role-Based Access Matrix

| Feature | User | Owner | Admin |
|-------|------|------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| Search Parking | ✅ | ❌ | ❌ |
| Book Parking | ✅ | ❌ | ❌ |
| Cancel Booking | ✅ | ❌ | ❌ |
| Booking History | ✅ | ✅ | ✅ |
| Add Parking | ❌ | ✅ | ❌ |
| Edit Parking | ❌ | ✅ | ❌ |
| Delete Parking | ❌ | ✅ | ❌ |
| Occupancy Monitoring | ❌ | ✅ | ✅ |
| Revenue Analytics | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Parking Moderation | ❌ | ❌ | ✅ |

---

# 📂 Project Structure

```bash
SmartPark/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   └── package.json
│
├── docs/
├── README.md
└── .gitignore
```

---

# 🔌 API Modules

## Authentication APIs

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
GET    /api/auth/me
```

---

## Parking APIs

```text
GET    /api/parkings
GET    /api/parkings/:id
POST   /api/parkings
PUT    /api/parkings/:id
DELETE /api/parkings/:id
```

---

## Booking APIs

```text
POST   /api/bookings
GET    /api/bookings
PATCH  /api/bookings/:id/cancel
PATCH  /api/bookings/:id/complete
```

---

## Payment APIs

```text
POST   /api/payments/create-order
POST   /api/payments/verify
POST   /api/payments/webhook
```

---

## Owner APIs

```text
GET    /api/owner/dashboard
GET    /api/owner/bookings
GET    /api/owner/analytics
```

---

## Admin APIs

```text
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/owners
GET    /api/admin/bookings
```

---

# ⚙️ Local Installation

## Clone Repository

```bash
git clone https://github.com/pankaj0160/SmartPark.git
cd SmartPark
```

---

# Backend Setup

```bash
cd server
npm install
```

Create:

```bash
server/.env
```

Example:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
GOOGLE_CLIENT_ID=your_google_client_id
```

Run backend:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client
npm install
```

Create:

```bash
client/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_public_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend:

```bash
npm run dev
```

---

# 🧪 Testing Checklist

## Driver Flow

- User registration
- Login
- Google authentication
- Search parking
- View details
- Create booking
- Payment success flow
- Payment failure flow
- Cancel booking
- Booking history

---

## Owner Flow

- Owner login
- Add parking
- Edit parking
- Delete parking
- Occupancy tracking
- Booking monitoring
- Analytics review

---

## Admin Flow

- Admin login
- Dashboard monitoring
- User management
- Owner moderation
- Booking oversight

---

## Critical Business Tests

- double booking prevention
- slot count consistency
- cancellation synchronization
- payment verification integrity
- booking lifecycle transitions
- occupancy updates
- authorization enforcement

---

# 🔐 Security Features

Implemented security protections:

- JWT authentication
- Protected API routes
- Role-based authorization
- Helmet security headers
- Rate limiting
- Mongo injection sanitization
- XSS request cleaning
- Secure CORS origin validation
- Payment verification checks

---

# 🚀 Deployment Architecture

Frontend:

```text
Vercel
```

Backend:

```text
Render
```

Database:

```text
MongoDB Atlas
```

Production URLs:

Frontend:
https://smart-park-client.vercel.app

Backend:
https://smartpark-1-sg1y.onrender.com

---

# 📈 Challenges Solved

Key engineering challenges addressed:

- CORS production deployment issues
- route mismatch debugging
- frontend/backend deployment synchronization
- payment verification handling
- occupancy consistency logic
- booking conflict prevention
- environment variable management
- authentication workflow debugging

---

# 🔮 Future Enhancements

Planned improvements:

- Live parking map visualization
- AI parking recommendations
- Dynamic pricing engine
- Demand heatmaps
- Predictive availability analytics
- QR-based parking entry
- Push notifications
- Email notification workflows
- OCR vehicle recognition
- Multi-city scalability

---

# 👨‍💻 Author

## Pankaj Thakur

B.Tech — Artificial Intelligence & Data Science  
Full Stack Developer | Problem Solver | Tech Enthusiast

GitHub:
https://github.com/pankaj0160

---

# 🤝 Contribution

Contributions are welcome.

Steps:

```bash
Fork repository
Create feature branch
Commit changes
Push branch
Create Pull Request
```

---

# ⭐ Support

If you found this project useful:

⭐ Star this repository  
🍴 Fork the project  
💡 Share feedback  

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### Built with passion for solving real-world parking challenges 🚗

</div>
