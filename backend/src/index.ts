import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { secureHeaders } from "./middleware/secureHeaders";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";
import { prisma } from "./lib/prisma";

const app = express();

// ── Security ─────────────────────────────────────────
app.use(secureHeaders);
const allowedOrigins =
  env.NODE_ENV === "development"
    ? [
        "http://localhost",
        "https://localhost",
        "http://localhost:3000",
        "https://localhost:3000",
        "http://localhost:5173",
        "https://localhost:5173",
      ]
    : env.PRODUCTION_URLS
      ? env.PRODUCTION_URLS.split(",").map((url) => url.trim())
      : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(apiLimiter);

// ── Parsers ──────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());

// ── Routes ───────────────────────────────────────────
app.use("/api", routes);

// ── 404 Handler ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ─────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────
async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (err) {
    console.error("❌ Failed to start:", err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
