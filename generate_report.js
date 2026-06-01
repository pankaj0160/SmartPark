const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, PageNumber, Header, Footer,
} = require('docx');
const fs = require('fs');

// ── Brand tokens ────────────────────────────────────────────────────────────
const GREEN      = "168556";
const GREEN_DARK = "0f5e3a";
const GREEN_LIGHT= "e8f5ee";
const SLATE      = "334155";
const MUTED      = "64748b";
const WHITE      = "FFFFFF";
const ROW_ALT    = "f4fdf8";

// ── Primitive builders ──────────────────────────────────────────────────────
const gap = (n = 120) =>
  new Paragraph({ children: [new TextRun("")], spacing: { before: 0, after: n } });

const pageBreak = () =>
  new Paragraph({ children: [new PageBreak()] });

// H1 — full-width green banner (always starts with a page break)
const h1 = (text, isFirst = false) => {
  const nodes = [];
  if (!isFirst) nodes.push(pageBreak());
  nodes.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text, bold: true, size: 34, color: WHITE, font: "Arial" })],
      shading: { fill: GREEN, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 220 },
      indent: { left: 160, right: 160 },
    })
  );
  return nodes;
};

// H2 — green underline sub-heading
const h2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 26, color: GREEN_DARK, font: "Arial" })],
    spacing: { before: 260, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GREEN, space: 6 } },
  });

// Body paragraph
const body = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: 22, color: SLATE, font: "Arial" })],
    spacing: { before: 60, after: 120 },
    alignment: AlignmentType.JUSTIFIED,
  });

// Bullet
const bullet = (text, boldPart = "") =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [
      boldPart
        ? new TextRun({ text: boldPart, bold: true, size: 22, color: GREEN_DARK, font: "Arial" })
        : null,
      new TextRun({ text, size: 22, color: SLATE, font: "Arial" }),
    ].filter(Boolean),
    spacing: { before: 50, after: 50 },
  });

// ── Table helpers ───────────────────────────────────────────────────────────
const BD   = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const BORD = { top: BD, bottom: BD, left: BD, right: BD };

const hCell = (text, w, bg = GREEN) =>
  new TableCell({
    borders: BORD,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 90, bottom: 90, left: 150, right: 150 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text, bold: true, size: 20,
            color: bg === GREEN ? WHITE : GREEN_DARK,
            font: "Arial",
          }),
        ],
      }),
    ],
  });

const dCell = (text, w, ri, bold = false, color = SLATE) =>
  new TableCell({
    borders: BORD,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: ri % 2 === 0 ? WHITE : ROW_ALT, type: ShadingType.CLEAR },
    margins: { top: 75, bottom: 75, left: 130, right: 130 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 19, color, bold, font: "Arial" })],
      }),
    ],
  });

const tbl = (headers, widths, rows) =>
  new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => hCell(h, widths[i])),
      }),
      ...rows.map((row, ri) =>
        new TableRow({
          children: row.map((cell, ci) => {
            if (typeof cell === "object" && cell.text !== undefined) {
              return dCell(cell.text, widths[ci], ri, cell.bold || false, cell.color || SLATE);
            }
            return dCell(String(cell ?? ""), widths[ci], ri);
          }),
        })
      ),
    ],
  });

// ════════════════════════════════════════════════════════════════════════════
// SECTION BUILDERS — each h1 section auto-starts on a new page
// ════════════════════════════════════════════════════════════════════════════

// ── COVER (Page 1) ──────────────────────────────────────────────────────────
const cover = [
  gap(1200),
  new Paragraph({
    children: [new TextRun({ text: "SmartPark", size: 80, bold: true, color: GREEN, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Intelligent Smart Parking Management System", size: 28, color: SLATE, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 380 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "──────────────────────────────────────", size: 22, color: GREEN, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 320 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Developed by", size: 22, color: MUTED, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Pankaj", size: 52, bold: true, color: GREEN_DARK, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "B.Tech — Artificial Intelligence & Data Science", size: 22, color: SLATE, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 480 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "──────────────────────────────────────", size: 22, color: GREEN, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 300 },
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Live App:  ", size: 21, color: MUTED, font: "Arial" }),
      new TextRun({ text: "https://smart-park-client.vercel.app", size: 21, color: GREEN, font: "Arial" }),
    ],
    alignment: AlignmentType.CENTER, spacing: { after: 100 },
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "GitHub:    ", size: 21, color: MUTED, font: "Arial" }),
      new TextRun({ text: "https://github.com/pankaj0160/SmartPark", size: 21, color: GREEN, font: "Arial" }),
    ],
    alignment: AlignmentType.CENTER, spacing: { after: 100 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "May 2026", size: 21, color: MUTED, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 0 },
  }),
  pageBreak(),
];

// ── SECTION 1 — What is SmartPark (Page 2) ─────────────────────────────────
const sWhatIs = [
  ...h1("What is SmartPark?", true),   // isFirst=true → no extra page break
  body("SmartPark is a full-stack web platform that makes finding and booking a parking spot as simple as ordering food online. Drivers discover available spaces near them, reserve a slot in seconds, and pay online — all without phone calls or guesswork. Parking space owners get a complete dashboard to manage listings, track bookings, and see how much they're earning. A platform admin keeps everything running smoothly by approving listings, managing users, and monitoring all activity."),
  gap(60),
  body("The platform is fully live at https://smart-park-client.vercel.app"),
  gap(160),

  h2("Three Roles, One Platform"),
  gap(60),

  tbl(
    ["Role", "What They Do on SmartPark"],
    [2000, 7360],
    [
      ["Driver / User", "Searches for nearby parking, filters by price and amenities, reserves a slot, pays online, and uses a booking code for physical entry."],
      ["Parking Owner", "Lists their space with photos and pricing, manages all reservations, monitors slot occupancy, and tracks daily/monthly revenue."],
      ["Platform Admin", "Approves or rejects new parking listings, manages user accounts, oversees all bookings, and views platform-wide statistics."],
    ]
  ),
];

// ── SECTION 2 — The Problem & Solution (Page 3) ─────────────────────────────
const sProblem = [
  ...h1("The Problem We're Solving"),
  body("Anyone who drives in an Indian city knows the frustration: you reach your destination but spend the next 20 minutes circling blocks looking for parking. The problem runs deeper than just inconvenience — it wastes fuel, increases traffic congestion, and costs money. Here is what is broken today:"),
  gap(60),
  bullet("Drivers have no way to know in advance which parking spots are free near where they're headed.", "No real-time visibility — "),
  bullet("When two people book the same spot simultaneously, both often succeed, causing conflicts at the gate.", "Double-booking chaos — "),
  bullet("Private operators manage everything on paper or via phone with zero insight into earnings or occupancy.", "Owners flying blind — "),
  bullet("There is no single platform covering discovery, reservation, payment, and physical verification end-to-end.", "No unified system — "),
  gap(120),

  h2("What SmartPark Fixes"),
  gap(60),
  bullet("Search parking by city or area, filter by price and amenities, see live slot counts, pay via Razorpay, and receive a booking code.", "Drivers — "),
  bullet("Create listings, upload photos, set custom pricing per vehicle type, monitor who booked what, and view earnings analytics.", "Owners — "),
  bullet("Approve or reject listings, block suspicious accounts, cancel any booking, and view platform-wide statistics.", "Admins — "),
  gap(120),

  h2("Who Benefits"),
  gap(60),
  tbl(
    ["Audience", "Primary Gain"],
    [3000, 6360],
    [
      ["Urban Drivers / Commuters", "No more aimless searching — know exactly where a slot is available and lock it in advance."],
      ["Parking Space Owners", "Turn an idle basement or open lot into a managed, revenue-tracked asset with zero paperwork."],
      ["Platform Administrators", "Full moderation control ensures listing quality, prevents fraud, and keeps the platform healthy."],
    ]
  ),
];

// ── SECTION 3 — System Architecture (Page 4) ────────────────────────────────
const sArch = [
  ...h1("System Architecture"),
  body("SmartPark uses a classic three-layer web architecture: a React frontend users interact with, a Node.js/Express backend that handles all business rules and security, and MongoDB as the primary database. On top of that, several specialist services handle specific jobs like payments, images, and maps."),
  gap(80),

  h2("Layer by Layer"),
  gap(60),

  tbl(
    ["Layer", "Technology", "Responsibility"],
    [2000, 2600, 4760],
    [
      ["Frontend", "React 19 + Vite + Tailwind CSS", "The UI that all three user roles interact with — responsive on desktop and mobile."],
      ["Routing (client)", "React Router v7", "Client-side navigation, protected routes, role-based redirects, URL-synced filters."],
      ["HTTP Client", "Axios", "All REST API calls with auto-injected JWT token and centralised error handling."],
      ["Real-time", "Socket.IO (client + server)", "Persistent WebSocket that pushes live slot updates and notifications instantly."],
      ["Backend API", "Node.js + Express 5", "REST API with 40+ endpoints, middleware pipeline, business logic layer."],
      ["Validation", "Zod 4", "Schema-based validation of every request body and query before logic runs."],
      ["Database", "MongoDB + Mongoose", "Document store for Users, Parkings, Bookings, Notifications, Reviews."],
      ["Payments", "Razorpay SDK", "Creates payment orders, verifies HMAC-SHA256 signatures, handles webhooks."],
      ["Images", "Cloudinary", "Parking listing photos uploaded via stream and served from global CDN."],
      ["Maps", "Leaflet + OpenStreetMap", "Interactive map page with markers, routing polyline, and landmark discovery."],
      ["Auth", "JWT + bcrypt + Google OAuth", "Stateless session tokens, password hashing at cost 12, Google sign-in."],
    ]
  ),
  gap(120),

  h2("Request Flow in Plain English"),
  gap(60),
  bullet("Browser loads the React app from Vercel's global CDN — fast anywhere in the world."),
  bullet("On login, a WebSocket connection opens to the backend for real-time updates throughout the session."),
  bullet("Every user action (search, book, pay) sends an HTTPS request to the Express API on Render."),
  bullet("The API validates the request, applies security middleware, runs business logic, and queries MongoDB Atlas."),
  bullet("After any booking event, the backend broadcasts a slot update to all connected browsers via Socket.IO — no page refresh needed."),
];

// ── SECTION 4 — Technology Stack (Page 5) ──────────────────────────────────
const sTech = [
  ...h1("Technology Stack"),

  h2("Frontend"),
  gap(60),
  tbl(
    ["Library / Tool", "Version", "Why We Use It"],
    [2200, 1200, 5960],
    [
      ["React", "19.2", "Core UI engine with hooks — manages all component state and lifecycle."],
      ["Vite", "7.3", "Blazing-fast dev server and optimised production bundler using native ES modules."],
      ["Tailwind CSS", "3.4", "Utility-first CSS — custom green brand palette, dark mode, responsive grids."],
      ["React Router", "v7", "Client-side routing with nested layouts, protected routes, and URL-synced filters."],
      ["Axios", "1.13", "HTTP client with singleton instance and automatic JWT header injection."],
      ["Socket.IO client", "4.8", "Persistent WebSocket for real-time slot updates and notifications."],
      ["Leaflet + React-Leaflet", "1.9 / 5.0", "Interactive OpenStreetMap tiles, custom markers, route polylines."],
      ["Recharts", "3.8", "Line, bar, and pie charts for owner/admin analytics dashboards."],
      ["Lucide React", "0.554", "Clean SVG icon set — 40+ icons used across the UI."],
      ["@react-oauth/google", "0.12", "Google Sign-In button and credential handling on the frontend."],
    ]
  ),
  gap(80),

  h2("Backend"),
  gap(60),
  tbl(
    ["Package", "Version", "Why We Use It"],
    [2200, 1200, 5960],
    [
      ["Node.js + Express", "5.2", "HTTP server, REST routing, async error handling, middleware pipeline."],
      ["MongoDB + Mongoose", "9.0", "Document store with geospatial indexes, aggregation pipelines, transactions."],
      ["bcryptjs", "3.0", "Password hashing at cost factor 12 — secure even if the database is leaked."],
      ["jsonwebtoken", "9.0", "JWT signing and verification — 7-day expiry, userId + role in payload."],
      ["Razorpay SDK", "2.9", "Order creation, HMAC-SHA256 payment verification, webhook processing."],
      ["Socket.IO server", "4.8", "WebSocket server with userId→socketId mapping for targeted notifications."],
      ["Zod", "4.1", "Schema validation for every API endpoint — rejects bad input before logic runs."],
      ["Cloudinary SDK", "2.10", "Image upload via buffer stream, public-ID deletion, CDN delivery."],
      ["Multer", "2.1", "Handles multipart/form-data for image file uploads (5MB cap, 5 files max)."],
      ["Helmet", "8.1", "Sets HTTP security headers on every response automatically."],
      ["express-rate-limit", "8.4", "Auth: 5 req/min. API: 100 req/min. Prevents brute-force attacks."],
      ["google-auth-library", "9.15", "Verifies Google ID tokens server-side before creating accounts."],
    ]
  ),
];

// ── SECTION 5 — Key Features Part 1 (Page 6) ──────────────────────────────
const sFeatures1 = [
  ...h1("Key Features — The Core Engine"),

  h2("1. Smart Slot Availability (No Stale Data Ever)"),
  gap(60),
  body("Most parking apps store a simple number like 'availableSlots = 5' in the database and update it every time someone books. The problem? Server restarts, failed transactions, or race conditions make that number drift and become wrong — sometimes showing slots that don't exist."),
  gap(60),
  body("SmartPark does it differently. That stored number is never used for availability decisions. Instead, the system always calculates available slots fresh by aggregating all confirmed bookings for the requested time window. The formula is: Available = Total Slots minus Slots Occupied by active bookings in the time range. This means the count is always accurate, regardless of what happened to the stored field."),
  gap(120),

  h2("2. Double Booking Prevention"),
  gap(60),
  body("What happens if two drivers hit Book Now at exactly the same millisecond for the last available slot? Without protection, both would see 1 slot available, both would create bookings, and both would show up claiming the same space."),
  gap(60),
  body("SmartPark prevents this using MongoDB transactions with a document-level lock. When a booking is being created, the system acquires a lock on that parking record, re-checks availability inside the lock, and only then creates the booking. The second concurrent request sees zero slots after acquiring the lock and receives a clear error. Exactly one booking succeeds every time, even under heavy concurrent load."),
  gap(120),

  h2("3. Real-Time Updates via WebSocket"),
  gap(60),
  body("When someone books a slot, every browser viewing that parking listing sees the slot count drop instantly — no page refresh needed. This works through Socket.IO, which keeps a live connection open between the browser and the server. The backend maintains a map of userId to open socket connections, so a user with three browser tabs open gets the notification in all three tabs simultaneously."),
  gap(60),
  tbl(
    ["Event", "Who Gets Notified", "What They See"],
    [2600, 2400, 4360],
    [
      ["Booking confirmed", "Driver + Owner + All Admins", "Notification bell badge increments, parking slot count updates."],
      ["Booking cancelled", "Driver + Owner + All Admins", "Slot count restores, cancellation notification delivered."],
      ["Booking completed", "Owner", "Booking marked complete in their reservations list."],
    ]
  ),
];

// ── SECTION 6 — Key Features Part 2 (Page 7) ──────────────────────────────
const sFeatures2 = [
  ...h1("Key Features — Discovery & Verification"),

  h2("4. Booking Codes for Physical Entry"),
  gap(60),
  body("Each confirmed booking gets a unique code like BOOK-X7KM3P2Q. The parking owner or admin types or scans this code at the gate to verify the reservation before allowing entry. The code is generated using cryptographically secure random bytes (not Math.random). To avoid human errors when reading codes aloud or off a screen, the character set deliberately excludes visually confusing characters: no O versus 0, no I versus l versus 1."),
  gap(120),

  h2("5. Smart Parking Recommendations"),
  gap(60),
  body("On the map page, the system scores nearby parkings using a multi-factor formula and surfaces the top three as labelled recommendations. The scoring works like this:"),
  gap(60),
  body("Score = (Distance in km × 0.5) + (Hourly Price × 0.3) − (Available Slots × 0.2)"),
  gap(60),
  body("A lower score means a better all-round recommendation — close, affordable, and available. Three badges are then assigned to the best candidates: Best Choice (overall lowest score), Closest (minimum distance), and Cheapest (minimum hourly price). This gives drivers a quick shortcut without reading through every listing."),
  gap(120),

  h2("6. Map Discovery with Routing & Landmarks"),
  gap(60),
  body("The map page uses the browser's Geolocation API to centre on your current position and show nearby parkings as map pins. Clicking Get Directions draws a driving route using OSRM (an open-source routing engine) with distance in kilometres and estimated travel time in minutes."),
  gap(60),
  body("The page also discovers useful nearby places — cafes, restaurants, hospitals, bus stops, pharmacies — by querying OpenStreetMap's public Overpass API within a 500-metre radius. Results are sorted by distance and clicking Navigate opens Google Maps walking directions. No paid map API key is required anywhere in this flow."),
  gap(120),

  h2("7. Guest-First Booking Experience"),
  gap(60),
  body("Users can browse, filter, view listing details, and even start a booking without being logged in. The moment they hit Book Now, the platform intercepts, shows a login/register modal, and saves their booking intent to sessionStorage. After authentication, the booking form reopens pre-filled with their original choices — no lost progress, no frustrating restarts."),
];

// ── SECTION 7 — Database Design (Page 8) ────────────────────────────────────
const sDB = [
  ...h1("Database Design"),
  body("SmartPark uses MongoDB with Mongoose ODM and five main collections. Here is a plain-English breakdown of what each stores and the key design decisions behind them."),
  gap(80),

  h2("Collections Overview"),
  gap(60),
  tbl(
    ["Collection", "Stores", "Key Design Decision"],
    [1800, 3200, 4360],
    [
      ["users", "Name, email, hashed password, role, profile sub-documents, status", "passwordHash field is select:false — excluded from every query by default. Google ID stored sparse for OAuth users only."],
      ["parkings", "Title, address, GPS coordinates, pricing map, images, operating hours, verification status", "Location stored as GeoJSON Point with a 2dsphere index enabling radius-based geospatial search. Status defaults to pending until an admin approves."],
      ["bookings", "Driver ref, parking ref, date, time window, slot count, payment status, booking code", "Compound index on parking+date+status+time enables fast overlap detection. Unique booking code per reservation with DB uniqueness enforced."],
      ["notifications", "User ref, message text, type, isRead flag", "Capped at 50 per user (oldest pruned). Delivered in real-time via Socket.IO emit on creation."],
      ["reviews", "User ref, parking ref, booking ref, rating (1-5), comment", "Unique index on booking field enforces exactly one review per booking at the database level — no application-layer workarounds needed."],
    ]
  ),
  gap(120),

  h2("Indexes That Matter"),
  gap(60),
  tbl(
    ["Collection", "Index", "Why It Exists"],
    [1800, 3200, 4360],
    [
      ["parkings", "{location: '2dsphere'}", "Powers the nearby search and map-based discovery with radius queries."],
      ["parkings", "{verificationStatus, isActive, city}", "Allows filtered public listing queries without full collection scans."],
      ["parkings", "{title, description, address, city} text", "Full-text search index powering the main search bar."],
      ["bookings", "{parking, bookingDate, status, startTime, endTime}", "The overlap detection query hits this index every time a booking is attempted."],
      ["bookings", "{user, createdAt desc}", "Driver booking history — sorted newest-first without sorting the whole collection."],
      ["notifications", "{userId, isRead, createdAt desc}", "Fast unread count and sorted notification list for the bell dropdown."],
    ]
  ),
  gap(120),

  h2("Entity Relationships"),
  gap(60),
  bullet("One User → Many Parkings (owner relationship)"),
  bullet("One User → Many Bookings (driver relationship)"),
  bullet("One User → Many Notifications"),
  bullet("One Parking → Many Bookings"),
  bullet("One Parking → Many Reviews"),
  bullet("One Booking → One Review (unique constraint at DB level)"),
];

// ── SECTION 8 — API Overview (Page 9) ──────────────────────────────────────
const sAPI = [
  ...h1("API Overview"),
  body("The backend exposes 40+ REST API endpoints organised by domain. Every response follows a consistent envelope shape: { success, data, message, errors }. All bodies and query parameters are validated by Zod schemas before any business logic runs."),
  gap(80),

  h2("Endpoint Groups"),
  gap(60),
  tbl(
    ["API Group", "Key Endpoints", "Accessible By"],
    [2200, 4000, 3160],
    [
      ["/api/auth/*", "Register, Login, Google OAuth, Get/Update profile, Change password", "Public (auth) + Authenticated (profile)"],
      ["/api/parkings/*", "List, filter, search nearby, get detail, smart recommendations, create, edit, delete, manage images, approve/reject", "Public (read) + Owner/Admin (write)"],
      ["/api/bookings/*", "View booking history, get single booking, cancel a booking", "Driver only"],
      ["/api/payments/*", "Create Razorpay order, verify payment signature, process webhook", "Driver + Public (webhook only)"],
      ["/api/owner/*", "View all bookings across listings, mark booking complete, verify by booking code", "Owner + Admin"],
      ["/api/admin/*", "Platform dashboard, approve/reject/toggle/delete listings, block/unblock users, cancel bookings, verify codes", "Admin only"],
      ["/api/notifications/*", "Fetch all notifications, mark one read, mark all read", "All authenticated roles"],
      ["/api/reviews/*", "Post review, get reviews for a parking, get review stats, owner review summary, admin delete", "Driver (post) + Public (read) + Admin (delete)"],
      ["/api/analytics/*", "Driver spend summary, Owner revenue and occupancy analytics, Admin platform statistics", "Role-specific (driver / owner / admin)"],
      ["/api/search/*", "Autocomplete suggestions for city, area, and parking name", "Public"],
    ]
  ),
  gap(120),

  h2("The Booking Payment Flow"),
  gap(60),
  body("This is the most complex flow in the platform — here is how it works step by step:"),
  gap(60),
  bullet("Driver fills the booking form (date, time window, vehicle type, slot count) and clicks Book and Pay."),
  bullet("Frontend calls POST /api/payments/create-order — server validates input, checks slot availability, creates a Razorpay order, and returns an order ID."),
  bullet("Razorpay's checkout UI opens in the browser. Driver completes payment."),
  bullet("Frontend calls POST /api/payments/verify with the payment ID, order ID, and signature."),
  bullet("Server fetches the Razorpay order to validate amount, then verifies HMAC-SHA256 signature using timing-safe comparison."),
  bullet("Inside a MongoDB transaction: locks the parking, re-checks overlap, creates the Booking document with a generated booking code."),
  bullet("Slot update broadcast goes to all connected browsers. Notifications sent to driver, owner, and admins. Booking confirmation shown to driver."),
];

// ── SECTION 9 — Security (Page 10) ─────────────────────────────────────────
const sSecurity = [
  ...h1("Security Implementation"),
  body("Security is layered throughout the stack — not bolted on at the end. Every request passes through a pipeline of protections before any business logic runs."),
  gap(80),

  h2("Security Middleware Pipeline"),
  gap(60),
  tbl(
    ["Middleware", "What It Does"],
    [2600, 6760],
    [
      ["Helmet", "Sets HTTP security headers on every response: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, and more."],
      ["CORS", "Validates the Origin header against a whitelist of allowed frontend URLs. Requests from unknown origins are rejected before they go anywhere."],
      ["mongoSanitize", "Strips MongoDB operator keys ($ and .) from all request body, query, and params to prevent NoSQL injection attacks."],
      ["xss-clean", "Removes script tags and XSS vectors from request body and params before validation runs."],
      ["authLimiter", "Authentication routes are rate-limited to 5 requests per minute per IP. Prevents brute-force password attacks."],
      ["apiLimiter", "All other API routes are rate-limited to 100 requests per minute per IP. Prevents abuse and scraping."],
      ["authenticate", "Extracts and verifies JWT Bearer token. Loads user from DB. Rejects suspended accounts before they reach any route."],
      ["authorizeRoles", "Checks req.user.role against the allowed roles for that route. Returns 403 Forbidden for wrong-role access attempts."],
      ["validateRequest", "Runs Zod schema validation. Returns 400 with field-level error messages. Replaces raw request input with validated/coerced values."],
    ]
  ),
  gap(120),

  h2("Password & Token Security"),
  gap(60),
  bullet("Passwords hashed with bcryptjs at cost factor 12 before storage. The passwordHash field is excluded from all database queries by default."),
  bullet("JWTs expire after 7 days, carry userId and role, and are verified on every protected request against a secret key stored only in environment variables."),
  bullet("Suspended users are rejected at the authenticate step even if their token is still valid."),
  gap(120),

  h2("Payment Security"),
  gap(60),
  bullet("Every payment is verified server-side by computing HMAC-SHA256(orderId|paymentId, secret) and comparing with Razorpay's signature."),
  bullet("Comparison uses crypto.timingSafeEqual — a constant-time function that prevents timing attacks where an attacker guesses the signature byte by byte."),
  bullet("Payment amount is fetched directly from Razorpay's API and compared against the calculated amount — the client cannot manipulate the price."),
  bullet("Duplicate payment verifications are detected and rejected idempotently — a payment can only confirm one booking."),
];

// ── SECTION 10 — Testing (Page 11) ─────────────────────────────────────────
const sTesting = [
  ...h1("Testing"),
  body("SmartPark has over 80 tests across four categories written using Node.js's built-in test runner — no external framework needed. All tests pass."),
  gap(80),

  h2("Test Categories"),
  gap(60),
  tbl(
    ["Category", "What Was Tested", "Count"],
    [2000, 6100, 1260],
    [
      ["Unit Tests", "Booking price calculation (ceil hours × slot count), filter serialization and URL params, theme resolution, profile payload builders, booking code format and uniqueness, code generator retry logic.", "~35"],
      ["Integration Tests", "Auth flow (register, login, Google OAuth), parking creation and admin approval, owner and admin actions, booking lifecycle (create, cancel, complete), review constraints, security validation of malformed inputs.", "~30"],
      ["End-to-End Tests", "Full booking flow from driver registration through payment verification to booking code confirmation. Owner verifies the code. Admin cancels a booking. All edge cases: past time, under 30 minutes, invalid parking, insufficient slots.", "~12"],
      ["Concurrency Tests", "Two drivers simultaneously attempt to book the last available slot. Exactly one succeeds. The other receives a 409 Conflict. Error message mentions slot availability. Validates the transaction-based race condition prevention.", "3"],
    ]
  ),
  gap(120),

  h2("Critical Test: Double Booking"),
  gap(60),
  body("The most important test in the suite fires two simultaneous booking requests for a parking with exactly one slot remaining. Both requests hit the server in parallel. The test then asserts: successes.length === 1 and failures[0].statusCode === 409. This proves the MongoDB transaction lock works correctly under real concurrent load — not just in isolation."),
  gap(120),

  h2("Frontend Test Highlights"),
  gap(60),
  tbl(
    ["Test File", "Key Assertions"],
    [3000, 6360],
    [
      ["bookingUtils.test.js", "Estimated total rounds up to ceiling hours. Status grouping correctly separates ongoing, upcoming, completed, cancelled bookings."],
      ["discoveryFilters.test.js", "All filter state serialises to URL params and restores from them identically — enabling shareable, bookmarkable search URLs."],
      ["guestSession.test.js", "Booking intent survives within a session, isolated between sessions, and clears correctly after authentication completes."],
      ["theme.test.js", "System theme respects OS dark/light preference. Explicit overrides take priority. Theme applied without browser APIs available."],
    ]
  ),
];

// ── SECTION 11 — Deployment (Page 12) ───────────────────────────────────────
const sDeployment = [
  ...h1("Deployment"),
  body("SmartPark is fully deployed across three cloud platforms — each chosen for what it does best. The frontend loads from a global CDN, the backend runs on a managed Node.js service, and the database lives on MongoDB Atlas with automatic backups."),
  gap(80),

  h2("Where SmartPark Lives"),
  gap(60),
  tbl(
    ["Service", "Platform", "URL / Notes"],
    [2000, 2000, 5360],
    [
      ["Frontend (React)", "Vercel CDN", "https://smart-park-client.vercel.app — served globally from edge nodes."],
      ["Backend (Node.js)", "Render", "https://smartpark-1-sg1y.onrender.com — auto-sleep on free tier after 15 min idle."],
      ["Database", "MongoDB Atlas (M0 free)", "512MB storage, automated backups, replica set, SRV connection string."],
      ["Image Storage", "Cloudinary", "Parking listing photos uploaded from backend, served via Cloudinary CDN."],
    ]
  ),
  gap(120),

  h2("Environment Variables"),
  gap(60),
  body("All secrets are stored as environment variables — never hardcoded in source code. Here are the key ones:"),
  gap(60),
  tbl(
    ["Variable", "Used By", "Purpose"],
    [2800, 1600, 4960],
    [
      ["MONGODB_URI", "Backend", "Atlas SRV connection string with credentials."],
      ["JWT_SECRET", "Backend", "Key used to sign and verify all JWT tokens. Keep this long and random."],
      ["RAZORPAY_KEY_ID / KEY_SECRET", "Backend + Frontend", "Payment gateway credentials. Secret stays server-side only."],
      ["CLOUDINARY_*", "Backend", "Cloud name, API key, and secret for image upload and deletion."],
      ["GOOGLE_CLIENT_ID", "Backend + Frontend", "OAuth app ID for verifying Google sign-in tokens."],
      ["CLIENT_URLS", "Backend", "Comma-separated list of allowed CORS origins (e.g. Vercel frontend URL)."],
      ["VITE_API_BASE_URL", "Frontend build", "Points the React app to the correct backend URL per environment."],
      ["ALLOW_TEST_PAYMENT / TEST_COUPON_CODE", "Backend (dev)", "Enables test payment mode that bypasses Razorpay for development."],
    ]
  ),
];

// ── SECTION 12 — Challenges (Page 13) ──────────────────────────────────────
const sChallenges = [
  ...h1("Challenges & How We Solved Them"),
  body("Every real-world project hits problems that tutorials do not cover. Here are the toughest ones encountered while building SmartPark, and exactly how each was resolved."),
  gap(80),

  tbl(
    ["Challenge", "What Went Wrong", "The Fix"],
    [2400, 2800, 4160],
    [
      [
        "Stale Slot Counts",
        "Updating availableSlots on every booking caused the number to drift after a crash or race condition — showing slots that did not exist.",
        "Removed the mutable counter entirely. Available slots are now always computed live from the Bookings collection via aggregation. Cannot drift.",
      ],
      [
        "Race Conditions",
        "Two concurrent booking requests both passed the availability check before either had committed to the database.",
        "Wrapped booking creation in a MongoDB transaction. A findOneAndUpdate on the parking record acts as a pessimistic lock — second request sees zero slots inside the lock.",
      ],
      [
        "Multi-Tab Notifications",
        "A user with three browser tabs received notifications only in the tab that first connected — other tabs missed them.",
        "Changed userSocketMap from a single socketId string to a Set of socketIds per user. emitToUser iterates the set and sends to every connected tab.",
      ],
      [
        "IST Timezone Bugs",
        "Booking cancellation logic produced incorrect results for bookings near midnight because server time did not match IST.",
        "Created getKolkataDateTimeMs helper that converts all booking times to UTC milliseconds using the IST offset (330 minutes) before any comparison.",
      ],
      [
        "CORS in Production",
        "Frontend on Vercel could not communicate with the backend on Render — origin mismatch errors blocked all requests.",
        "Switched to CORS callback mode with dynamic origin validation. CLIENT_URLS env variable controls the exact allowlist, trimmed and split on startup.",
      ],
      [
        "Leaflet Icons Breaking",
        "Default Leaflet marker icons disappeared entirely in the Vite production build due to broken asset path resolution.",
        "Replaced all default icons with L.icon using absolute CDN URLs. Smart recommendation markers use custom L.divIcon with inline HTML for the badge.",
      ],
    ]
  ),
  gap(120),

  h2("Key Learning from Challenges"),
  gap(60),
  body("The recurring theme across all these challenges is the same: do not trust mutable stored state for critical decisions. Compute it fresh. The occupancy engine, the availability check inside a transaction, and the multi-tab socket map are all expressions of this single principle applied to different problems."),
];

// ── SECTION 13 — Future Plans (Page 14) ────────────────────────────────────
const sFuture = [
  ...h1("Future Plans"),
  body("SmartPark is built on a solid, extensible foundation. These are the enhancements planned for the next version — each has a clear implementation path on the current architecture."),
  gap(80),

  tbl(
    ["Feature", "Why It Matters", "Technical Approach"],
    [2200, 2800, 4360],
    [
      [
        "QR Code Entry",
        "Replaces manual code entry with a scan at the barrier — enables fully automated access control.",
        "Generate QR code server-side from the booking code, embed in confirmation screen and email. Barrier scanner calls the verify endpoint.",
      ],
      [
        "Push Notifications",
        "Alerts drivers 30 min before their booking starts, even when the browser is closed.",
        "Service worker registers for Web Push. Backend uses the Push API with VAPID keys to send scheduled reminders.",
      ],
      [
        "Dynamic Pricing",
        "Owners set surge rates for peak hours and discounts for off-peak — maximises revenue automatically.",
        "Add pricing rules to the Parking schema. Booking order creation selects the applicable rate from the active rule at that time.",
      ],
      [
        "AI Recommendations",
        "Replace the current formula with a model trained on historical booking patterns and user preferences.",
        "Collect booking outcome data, train a lightweight ranking model, serve predictions via a Python microservice called from the Node.js backend.",
      ],
      [
        "Refunds & GST Invoices",
        "When a booking is cancelled, drivers expect their money back. Indian businesses need GST-compliant receipts.",
        "Razorpay supports refund API calls. Invoice generation uses a template with GST fields populated from booking and owner profile data.",
      ],
      [
        "Monthly Passes",
        "Daily commuters want a flat monthly rate for the same spot — more predictable cost, guaranteed availability.",
        "Add a subscription type to Parking. Integrate Razorpay Subscriptions API for recurring billing. Block reserved slot in the occupancy engine.",
      ],
    ]
  ),
];

// ── THANK YOU (Last Page) ────────────────────────────────────────────────────
const sThankYou = [
  pageBreak(),
  gap(1500),
  new Paragraph({
    children: [new TextRun({ text: "Thank You", size: 88, bold: true, color: GREEN, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "──────────────────────────────────────", size: 22, color: GREEN, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 260 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "SmartPark — Intelligent Parking Management System", size: 26, color: SLATE, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Pankaj  |  B.Tech AI & DS  |  May 2026", size: 22, color: MUTED, font: "Arial" })],
    alignment: AlignmentType.CENTER, spacing: { after: 240 },
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Live App: ", size: 21, color: MUTED, font: "Arial" }),
      new TextRun({ text: "https://smart-park-client.vercel.app", size: 21, color: GREEN, font: "Arial" }),
    ],
    alignment: AlignmentType.CENTER, spacing: { after: 100 },
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "GitHub: ", size: 21, color: MUTED, font: "Arial" }),
      new TextRun({ text: "https://github.com/pankaj0160/SmartPark", size: 21, color: GREEN, font: "Arial" }),
    ],
    alignment: AlignmentType.CENTER, spacing: { after: 0 },
  }),
];

// ════════════════════════════════════════════════════════════════════════════
// ASSEMBLE DOCUMENT
// ════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "◆",
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 720, hanging: 360 } },
            run: { color: GREEN, font: "Arial", size: 18 },
          },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: SLATE } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 34, bold: true, font: "Arial", color: WHITE },
        paragraph: { spacing: { before: 0, after: 220 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: GREEN_DARK },
        paragraph: { spacing: { before: 260, after: 100 }, outlineLevel: 1 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1000, bottom: 1080, left: 1000 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "SmartPark — Project Report", size: 18, color: GREEN, font: "Arial" }),
                new TextRun({ text: "   |   Pankaj", size: 18, color: MUTED, font: "Arial" }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 4 } },
              spacing: { after: 160 },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "SmartPark   |   Page ", size: 18, color: MUTED, font: "Arial" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GREEN, font: "Arial" }),
                new TextRun({ text: "   |   May 2026", size: 18, color: MUTED, font: "Arial" }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 4 } },
              spacing: { before: 160 },
            }),
          ],
        }),
      },
      children: [
        // Each section auto-starts new page via the h1() helper (pageBreak inserted before every heading)
        ...cover,
        ...sWhatIs,
        ...sProblem,
        ...sArch,
        ...sTech,
        ...sFeatures1,
        ...sFeatures2,
        ...sDB,
        ...sAPI,
        ...sSecurity,
        ...sTesting,
        ...sDeployment,
        ...sChallenges,
        ...sFuture,
        ...sThankYou,
      ],
    },
  ],
});

const path = require("path");

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, "SmartPark_Report_Pankaj.docx");
  fs.writeFileSync(out, buf);
  console.log("Done:", out);
});