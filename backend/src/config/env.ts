import dotenv from "dotenv";
import { z } from "zod";

const envFile = `.env.${process.env.NODE_ENV ?? "development"}`;
dotenv.config({ path: envFile });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().optional(),
  PRODUCTION_URLS: z.string().optional(),
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  UPLOAD_DIR: z.string().default("./uploads"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default("ap-southeast-2"),
  AWS_S3_BUCKET: z.string().optional(),
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment validation error:", parsed.error.format());
  process.exit(1);
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  databaseUrl: parsed.data.DATABASE_URL,
  port: parsed.data.PORT,
  jwt: {
    accessSecret: parsed.data.JWT_ACCESS_SECRET,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  },
  cors: {
    origin: parsed.data.CORS_ORIGIN,
    productionUrls: parsed.data.PRODUCTION_URLS,
  },
  upload: {
    maxFileSizeMb: parsed.data.MAX_FILE_SIZE_MB,
    dir: parsed.data.UPLOAD_DIR,
  },
  rateLimit: {
    windowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
    maxRequests: parsed.data.RATE_LIMIT_MAX_REQUESTS,
  },
  aws: {
    accessKeyId: parsed.data.AWS_ACCESS_KEY_ID,
    secretAccessKey: parsed.data.AWS_SECRET_ACCESS_KEY,
    region: parsed.data.AWS_REGION,
    s3Bucket: parsed.data.AWS_S3_BUCKET,
  },
};

// Keep backward-compatible `env` export
export const env = parsed.data;
