/**
 * Notification Controller
 */
import { Request, Response } from "express";
import { notificationService } from "../services/notificationService";

export async function getMyNotifications(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await notificationService.getMyNotifications(userId, page, limit);
  return res.json(result);
}

export async function getUnreadCount(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const count = await notificationService.getUnreadCount(userId);
  return res.json({ count });
}

export async function markAsRead(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const result = await notificationService.markAsRead(id, userId);
  return res.json(result);
}

export async function markAllAsRead(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await notificationService.markAllAsRead(userId);
  return res.json(result);
}
