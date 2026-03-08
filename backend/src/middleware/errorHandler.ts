/**
 * Global Error Handler Middleware
 * Catches errors thrown from services with `status` property
 */
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error("Error:", err.message || err);

  const status = err.status || 500;
  const message = status === 500 && env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message || "Internal server error";

  res.status(status).json({ error: message });
}
