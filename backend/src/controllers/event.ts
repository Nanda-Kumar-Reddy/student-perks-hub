/**
 * Event Controller
 */
import { Request, Response } from "express";
import { eventService } from "../services/eventService";

export async function registerForEvent(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await eventService.register(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyEventRegistrations(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await eventService.getMyRegistrations(userId, page, limit);
  return res.json(result);
}
