import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { config } from "../config/env";

export interface AuthPayload {
  userId: string;
  role: string;
}

/**
 * Socket.io authentication middleware.
 * Verifies JWT from handshake auth token.
 */
export function authSocketMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret, {
      issuer: "lifeline-australia",
      audience: "lifeline-app",
    }) as AuthPayload;

    (socket as any).user = payload;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(new Error("Token expired"));
    }
    return next(new Error("Invalid token"));
  }
}
