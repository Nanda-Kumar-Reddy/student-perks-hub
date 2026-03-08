# LifelineAustralia — Node.js Backend

Production-ready Express + Prisma + PostgreSQL backend with enterprise security.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env    # Fill in your secrets
npx prisma migrate dev  # Create database tables
npm run dev              # Start dev server on :4000
```

## Architecture

```
backend/
├── prisma/schema.prisma        # Database schema (PostgreSQL)
├── src/
│   ├── index.ts                # Express entry point
│   ├── config/env.ts           # Zod-validated environment variables
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── jwt.ts              # Access + Refresh token generation/verification
│   ├── middleware/
│   │   ├── auth.ts             # JWT Bearer authentication
│   │   ├── rbac.ts             # Role-based access control
│   │   ├── validate.ts         # Zod request validation
│   │   ├── rateLimiter.ts      # API + auth rate limiting
│   │   ├── secureHeaders.ts    # Helmet (CSP, HSTS, etc.)
│   │   └── upload.ts           # Multer with MIME/extension security
│   ├── validators/             # Zod schemas for all inputs
│   ├── controllers/            # Business logic
│   ├── routes/                 # Express routers
│   └── utils/password.ts       # bcrypt hashing
```

## Security Features

| Feature                | Implementation                                      |
|------------------------|-----------------------------------------------------|
| Authentication         | JWT Access (15m) + Refresh (7d) with rotation       |
| Password Hashing       | bcrypt with 12 salt rounds                          |
| RBAC                   | Middleware: `rbac("admin", "vendor")`                |
| Input Validation       | Zod schemas on body, query, params                  |
| Rate Limiting          | 100 req/15m general, 10 req/15m auth                |
| Secure Headers         | Helmet (CSP, HSTS, X-Frame-Options, etc.)           |
| File Upload Security   | MIME validation, extension blocking, random names    |
| Secrets Management     | Zod-validated .env, fails fast on missing vars       |
| Refresh Token Storage  | SHA-256 hashed in DB, revocation + rotation          |
| CORS                   | Strict origin, credentials, methods                  |
| Error Handling         | No internal leaks in production                      |

## API Routes

| Method | Route                          | Auth     | Role          |
|--------|--------------------------------|----------|---------------|
| POST   | `/api/auth/signup`             | Public   | —             |
| POST   | `/api/auth/login`              | Public   | —             |
| POST   | `/api/auth/refresh`            | Public   | —             |
| POST   | `/api/auth/logout`             | Bearer   | Any           |
| GET    | `/api/auth/me`                 | Bearer   | Any           |
| GET    | `/api/profiles/me`             | Bearer   | Any           |
| PATCH  | `/api/profiles/me`             | Bearer   | Any           |
| GET    | `/api/profiles`                | Bearer   | Admin         |
| POST   | `/api/bookings`                | Bearer   | Any           |
| GET    | `/api/bookings/mine`           | Bearer   | Any           |
| GET    | `/api/bookings/:id`            | Bearer   | Owner/Admin   |
| PATCH  | `/api/bookings/:id/cancel`     | Bearer   | Owner         |
| PATCH  | `/api/bookings/:id/status`     | Bearer   | Vendor/Admin  |
| GET    | `/api/bookings`                | Bearer   | Admin         |
| GET    | `/api/health`                  | Public   | —             |

## Deployment

```bash
npm run build
npx prisma migrate deploy
npm start
```

Works on any Node.js host: AWS EC2/ECS, Railway, Render, DigitalOcean, etc.
