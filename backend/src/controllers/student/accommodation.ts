/**
 * Accommodation Controller
 */
import { Request, Response } from "express";
import { accommodationService } from "../../services/student/accommodationService";

export async function createChat(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await accommodationService.createEnquiry(userId, {
    ...req.body,
    type: "chat",
  });
  return res.status(201).json(result);
}

export async function createEnquiry(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await accommodationService.createEnquiry(userId, {
    ...req.body,
    type: "enquiry",
  });
  return res.status(201).json(result);
}

export async function getMyEnquiries(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await accommodationService.getMyEnquiries(userId, page, limit);
  return res.json(result);
}
