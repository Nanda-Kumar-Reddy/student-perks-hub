import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { hashPassword, verifyPassword } from "../utils/password";
import { AppRole } from "@prisma/client";
import crypto from "crypto";

// ── Sign Up ──────────────────────────────────────────
export async function signup(req: Request, res: Response) {
  const { email, password, fullName, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      profile: {
        create: { fullName },
      },
      roles: {
        create: { role: role as AppRole },
      },
    },
    include: { roles: true, profile: true },
  });

  const userRole = user.roles[0]?.role ?? "student";
  const accessToken = generateAccessToken({ userId: user.id, role: userRole });
  const refreshToken = generateRefreshToken({ userId: user.id, role: userRole });

  // Store refresh token (hashed)
  const hashedRefresh = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: hashedRefresh,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Set refresh token in httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });

  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: userRole,
    },
    accessToken,
  });
}

// ── Login ────────────────────────────────────────────
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { roles: true, profile: true },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const userRole = user.roles[0]?.role ?? "student";
  const accessToken = generateAccessToken({ userId: user.id, role: userRole });
  const refreshToken = generateRefreshToken({ userId: user.id, role: userRole });

  const hashedRefresh = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: hashedRefresh,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: userRole,
    },
    accessToken,
  });
}

// ── Refresh Token ────────────────────────────────────
export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const payload = verifyRefreshToken(token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const stored = await prisma.refreshToken.findUnique({
      where: { token: hashedToken },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    // Rotate: revoke old, issue new
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { roles: true },
    });
    if (!user) return res.status(401).json({ error: "User not found" });

    const userRole = user.roles[0]?.role ?? "student";
    const newAccessToken = generateAccessToken({ userId: user.id, role: userRole });
    const newRefreshToken = generateRefreshToken({ userId: user.id, role: userRole });

    const newHashedRefresh = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: newHashedRefresh,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}

// ── Logout ───────────────────────────────────────────
export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.refreshToken.updateMany({
      where: { token: hashedToken },
      data: { revoked: true },
    });
  }

  res.clearCookie("refreshToken", { path: "/api/auth" });
  return res.json({ message: "Logged out" });
}

// ── Get Current User ─────────────────────────────────
export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, roles: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({
    id: user.id,
    email: user.email,
    fullName: user.profile?.fullName,
    avatarUrl: user.profile?.avatarUrl,
    phone: user.profile?.phone,
    address: user.profile?.address,
    university: user.profile?.university,
    role: user.roles[0]?.role ?? "student",
  });
}
