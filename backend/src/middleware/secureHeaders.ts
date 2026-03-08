import helmet from "helmet";
import { RequestHandler } from "express";

/**
 * Secure HTTP Headers Middleware (via Helmet)
 * - CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.
 */
export const secureHeaders: RequestHandler = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for OAuth
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});
