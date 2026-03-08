import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

/**
 * JWT Authentication Middleware
 * Extracts and verifies Bearer token from Authorization header.
 * Attaches decoded payload to req.user
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}
