/**
 * Auth Wrapper
 * Abstracts authentication operations (JWT, OAuth, OTP).
 * Swap this wrapper to migrate from custom JWT to Cognito, Auth0, etc.
 */
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, TokenPayload } from "../lib/jwt";
import { hashPassword, verifyPassword } from "../utils/password";
import { db } from "./databaseWrapper";
import crypto from "crypto";

class AuthWrapper {
  // ── Password ──────────────────────────────────────

  async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return verifyPassword(password, hash);
  }

  // ── Tokens ────────────────────────────────────────

  generateAccessToken(payload: TokenPayload): string {
    return generateAccessToken(payload);
  }

  generateRefreshToken(payload: TokenPayload): string {
    return generateRefreshToken(payload);
  }

  verifyAccessToken(token: string): TokenPayload {
    return verifyAccessToken(token);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return verifyRefreshToken(token);
  }

  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  // ── Refresh Token Storage ─────────────────────────

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    const hashedToken = this.hashToken(token);
    await db.create("RefreshToken", {
      userId,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  async validateAndRevokeRefreshToken(token: string): Promise<{ userId: string; role: string } | null> {
    const hashedToken = this.hashToken(token);
    const stored = await db.client.refreshToken.findUnique({
      where: { token: hashedToken },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return null;
    }

    await db.client.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const payload = this.verifyRefreshToken(token);
    return { userId: payload.userId, role: payload.role };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const hashedToken = this.hashToken(token);
    await db.client.refreshToken.updateMany({
      where: { token: hashedToken },
      data: { revoked: true },
    });
  }

  // ── Password Reset Tokens ──────────────────────────

  generateResetToken(userId: string): string {
    const payload: TokenPayload = { userId, role: "reset" };
    // Use access token with short expiry (15 min)
    return generateAccessToken(payload);
  }

  verifyResetToken(token: string): string | null {
    try {
      const payload = verifyAccessToken(token);
      if (payload.role !== "reset") return null;
      return payload.userId;
    } catch {
      return null;
    }
  }

  // ── OTP ───────────────────────────────────────────

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOtp(userId: string, code: string, purpose: string): Promise<void> {
    // Invalidate previous OTPs for same purpose
    await db.client.otpCode.updateMany({
      where: { userId, purpose, used: false },
      data: { used: true },
    });

    await db.create("OtpCode", {
      userId,
      code,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });
  }

  async verifyOtp(userId: string, code: string, purpose: string): Promise<boolean> {
    const otp = await db.client.otpCode.findFirst({
      where: {
        userId,
        code,
        purpose,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) return false;

    await db.client.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return true;
  }

  // ── Cookie Config ─────────────────────────────────

  getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    };
  }
}

export const auth = new AuthWrapper();
