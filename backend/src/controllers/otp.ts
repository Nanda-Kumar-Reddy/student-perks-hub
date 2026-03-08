/**
 * OTP Controller
 */
import { Request, Response } from "express";
import { authService } from "../services/authService";

export async function sendOtp(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { purpose } = req.body;
  const result = await authService.sendOtp(userId, purpose);
  return res.json(result);
}

export async function verifyOtp(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { code, purpose } = req.body;
  const result = await authService.verifyOtp(userId, code, purpose);
  return res.json(result);
}
