/**
 * Student Dashboard Controller
 */
import { Request, Response } from "express";
import { studentDashboardService } from "../../services/student/studentDashboardService";

export async function getMyBookings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await studentDashboardService.getMyBookings(userId, page, limit);
  return res.json(result);
}

export async function getMyRequests(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await studentDashboardService.getMyRequests(userId, page, limit);
  return res.json(result);
}
