/**
 * Profile Controller — thin, delegates to profileService
 */
import { Request, Response } from "express";
import { profileService } from "../services/profileService";

export async function getMyProfile(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profile = await profileService.getMyProfile(userId);
  return res.json(profile);
}

export async function updateMyProfile(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profile = await profileService.updateMyProfile(userId, req.body);
  return res.json(profile);
}

export async function listProfiles(req: Request, res: Response) {
  const { page, limit, sortBy, sortOrder } = req.query as any;
  const result = await profileService.listProfiles(page, limit, sortBy, sortOrder);
  return res.json(result);
}
