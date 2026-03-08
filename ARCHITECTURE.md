# LifelineAustralia — Multi-Server Architecture

## Architecture Overview

The platform runs on **three separate servers**:

```
root/
├── src/                    # SERVER 1 — Frontend (React/Vite)
├── backend/                # SERVER 2 — Backend API (Node.js/Express)
├── realtime-server/        # SERVER 3 — Realtime (Socket.io)
```

---

## SERVER 1 — Frontend (`src/`)

**Stack:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion

**Port:** 5173 (dev)

```
src/
├── components/         # UI components (shared, layout, feature-specific)
├── pages/              # Route pages (public, dashboard/student, vendor, admin)
├── contexts/           # React context providers (Auth, Chat)
├── hooks/              # Custom hooks
├── services/           # API client, auth, socket, storage, database
├── integrations/       # Supabase client (auto-generated)
├── assets/             # Static assets
└── types/              # TypeScript types
```

### Key Services
| File | Purpose |
|------|---------|
| `services/api.ts` | Centralized HTTP client → Backend API |
| `services/auth.ts` | Authentication (Supabase Auth) |
| `services/socket.ts` | WebSocket client → Realtime Server |
| `services/storage.ts` | File uploads (Supabase Storage) |
| `services/database.ts` | Direct DB queries (Supabase) |

---

## SERVER 2 — Backend API (`backend/`)

**Stack:** Node.js, Express, Prisma ORM, PostgreSQL

**Port:** 4000 (dev)

```
backend/
├── prisma/             # Database schema & migrations
├── src/
│   ├── config/         # Environment config
│   ├── controllers/    # Request handlers (thin — delegates to services)
│   ├── lib/            # Prisma client, JWT utilities
│   ├── middleware/      # Auth, RBAC, validation, rate limiting, uploads, secure headers
│   ├── routes/         # Express route definitions
│   ├── services/       # Business logic layer
│   ├── utils/          # Helpers (catchErrors, password)
│   ├── validators/     # Zod schemas for input validation
│   └── wrappers/       # Provider abstraction (DB, Auth, Storage, Notifications, Payments)
```

### API Routes Summary

| Prefix | Module | Methods |
|--------|--------|---------|
| `/api/auth` | Authentication | signup, login, google-login, refresh, logout, me |
| `/api/otp` | OTP | send, verify |
| `/api/profiles` | Profiles | get/update me, my tasks/approvals/history, admin list |
| `/api/notifications` | Notifications | list, unread-count, mark-read, mark-all-read |
| `/api/airport-pickups` | Airport Pickup | create, my-requests |
| `/api/accommodations` | Accommodations | chat, enquiry, my-enquiries |
| `/api/jobs` | Jobs | apply (file upload), my-applications |
| `/api/loans` | Loans | apply, my-applications |
| `/api/consultations` | Consultations | book, my-bookings |
| `/api/accounting` | Accounting | book, my-bookings |
| `/api/cars` | Cars | request, my-requests |
| `/api/events` | Events | register, my-registrations |
| `/api/certifications` | Certifications | request, my-requests |
| `/api/driving-license` | Driving License | book, my-bookings |
| `/api/students` | Student Dashboard | my-bookings, my-requests |
| `/api/community/tasks` | Community Tasks | CRUD, apply, messages, admin actions |
| `/api/bookings` | Legacy Bookings | CRUD, cancel, admin list |
| `/api/chat` | Chat (REST) | conversations, messages, start |
| `/api/payments` | Payments (Stripe) | create-intent, verify, my-payments, refund, webhook |
| `/api/vendor` | Vendor Portal | dashboard, transactions, coupons, analytics, settings |
| `/api/admin` | Admin Portal | dashboard, users, vendors, transactions, analytics |

### Security
- JWT access/refresh token rotation (httpOnly cookies)
- RBAC middleware (`student`, `vendor`, `admin`)
- Helmet secure headers
- Rate limiting (configurable)
- Zod input validation on all routes
- Password hashing with bcrypt

---

## SERVER 3 — Realtime (`realtime-server/`)

**Stack:** Node.js, Express, Socket.io, Prisma ORM

**Port:** 4001 (dev)

```
realtime-server/
├── src/
│   ├── config/         # Environment config
│   ├── middlewares/     # Socket JWT auth
│   ├── services/       # Chat, notification, online tracking, Prisma
│   └── socketHandlers/ # Chat & notification event handlers
```

### Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinConversation` | Client → Server | Join a chat room |
| `leaveConversation` | Client → Server | Leave a chat room |
| `sendMessage` | Client → Server | Send chat message |
| `receiveMessage` | Server → Client | Receive chat message |
| `messageRead` | Client → Server | Mark messages read |
| `messagesRead` | Server → Client | Broadcast read receipts |
| `typing` / `stopTyping` | Client → Server | Typing indicators |
| `userTyping` / `userStopTyping` | Server → Client | Typing broadcasts |
| `conversationUpdated` | Server → Client | Conversation sidebar refresh |
| `getOnlineUsers` | Client → Server | Request online user list |
| `onlineUsers` | Server → Client | Online user IDs |
| `userOnline` / `userOffline` | Server → Client | Presence broadcasts |
| `newNotification` | Server → Client | Push notification |
| `markNotificationRead` | Client → Server | Mark notification read |
| `markAllNotificationsRead` | Client → Server | Mark all read |

### REST Endpoint
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/push-notification` | Backend → Realtime push |
| GET | `/health` | Health check |

---

## Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_API_BASE_URL=http://localhost:4000
VITE_REALTIME_SERVER_URL=http://localhost:4001
```

### Backend (`backend/.env.development`)
```
DATABASE_URL=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

### Realtime (`realtime-server/.env.development`)
```
DATABASE_URL=...
JWT_ACCESS_SECRET=...
API_SERVER_URL=http://localhost:4000
```

---

## Running the Platform

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend API
cd backend && npm run dev

# Terminal 3 — Realtime Server
cd realtime-server && npm run dev
```

---

## User Roles

| Role | Dashboard | Access |
|------|-----------|--------|
| `student` | Student Dashboard | All student features, community tasks, chat |
| `vendor` | Vendor Dashboard | Coupons, transactions, analytics, settings |
| `admin` | Admin Dashboard | Users, vendors, transactions, analytics, community moderation |
