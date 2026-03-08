# ============================================
# Realtime Server — Dockerfile
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Copy prisma schema from backend (shared DB)
# In production, copy the prisma folder or use a shared package
COPY prisma ./prisma 2>/dev/null || true
RUN npx prisma generate 2>/dev/null || true

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Production image ─────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

# Copy prisma client if generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma 2>/dev/null || true
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma 2>/dev/null || true

# Copy compiled output
COPY --from=builder /app/dist ./dist

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 4001

CMD ["node", "dist/server.js"]
