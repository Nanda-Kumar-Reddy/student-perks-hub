/**
 * Job Application Controller
 */
import { Request, Response } from "express";
import { jobApplicationService } from "../../services/student/jobApplicationService";

export async function applyForJob(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const file = req.file;
  const result = await jobApplicationService.apply(userId, req.body, file);
  return res.status(201).json(result);
}

export async function getMyApplications(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await jobApplicationService.getMyApplications(userId, page, limit);
  return res.json(result);
}
