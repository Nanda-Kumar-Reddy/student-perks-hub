/**
 * Certification Controller
 */
import { Request, Response } from "express";
import { certificationService } from "../services/certificationService";

export async function requestCertification(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await certificationService.request(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyCertificationRequests(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await certificationService.getMyRequests(userId, page, limit);
  return res.json(result);
}
