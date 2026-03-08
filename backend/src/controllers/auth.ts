/**
 * Auth Controller — thin, delegates to authService
 */
import { Request, Response } from "express";
import { authService } from "../services/authService";
import { auth } from "../wrappers/authWrapper";

export async function signup(req: Request, res: Response) {
  const result = await authService.signup(req.body);

  res.cookie("refreshToken", result.refreshToken, auth.getRefreshCookieOptions());

  return res.status(201).json({
    user: result.user,
    accessToken: result.accessToken,
  });
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, auth.getRefreshCookieOptions());

  return res.json({
    user: result.user,
    accessToken: result.accessToken,
  });
}

export async function googleLogin(req: Request, res: Response) {
  const result = await authService.googleLogin(req.body);

  res.cookie("refreshToken", result.refreshToken, auth.getRefreshCookieOptions());

  return res.json({
    user: result.user,
    accessToken: result.accessToken,
  });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  const result = await authService.refresh(token);

  res.cookie("refreshToken", result.refreshToken, auth.getRefreshCookieOptions());

  return res.json({ accessToken: result.accessToken });
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.cookies?.refreshToken);

  res.clearCookie("refreshToken", { path: "/api/auth" });
  return res.json({ message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await authService.getMe(userId);
  return res.json(user);
}
