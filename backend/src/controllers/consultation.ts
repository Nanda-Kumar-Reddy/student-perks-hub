/**
 * Consultation Controller
 */
import { Request, Response } from "express";
import { consultationService } from "../services/consultationService";

export async function bookConsultation(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await consultationService.book(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyConsultations(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await consultationService.getMyBookings(userId, page, limit);
  return res.json(result);
}
