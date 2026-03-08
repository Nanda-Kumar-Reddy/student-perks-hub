import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? "development"}` });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4001),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().optional(),
  PRODUCTION_URLS: z.string().optional(),
  API_SERVER_URL: z.string().default("http://localhost:4000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Realtime server env validation error:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  jwt: { accessSecret: env.JWT_ACCESS_SECRET },
  cors: { origin: env.CORS_ORIGIN, productionUrls: env.PRODUCTION_URLS },
  apiServerUrl: env.API_SERVER_URL,
};
