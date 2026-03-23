/**
 * Community Task Controller — thin, delegates to service
 */
import { Request, Response } from "express";
import { communityTaskService } from "../../services/community/communityTaskService";

export async function createTask(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const task = await communityTaskService.createTask(userId, req.body);
  return res.status(201).json(task);
}

export async function listTasks(req: Request, res: Response) {
  const result = await communityTaskService.listApprovedTasks(req.query as any);
  return res.json(result);
}

export async function getTaskById(req: Request, res: Response) {
  const task = await communityTaskService.getTaskById(req.params.id);
  return res.json(task);
}

export async function getMyTasks(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await communityTaskService.getMyTasks(userId, page, limit);
  return res.json(result);
}

export async function applyForTask(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const application = await communityTaskService.applyForTask(req.params.id, userId, req.body.message);
  return res.status(201).json(application);
}

export async function updateTaskStatus(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const task = await communityTaskService.updateTaskStatus(req.params.id, userId, req.body.status);
  return res.json(task);
}

export async function sendMessage(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const message = await communityTaskService.sendMessage(req.params.id, userId, req.body.content);
  return res.status(201).json(message);
}

export async function getMessages(req: Request, res: Response) {
  const { page, limit } = req.query as any;
  const result = await communityTaskService.getMessages(req.params.id, page, limit);
  return res.json(result);
}

// ── Admin ────────────────────────────────────────────
export async function getPendingTasks(req: Request, res: Response) {
  const { page, limit } = req.query as any;
  const result = await communityTaskService.getPendingTasks(page, limit);
  return res.json(result);
}

export async function approveTask(req: Request, res: Response) {
  const task = await communityTaskService.approveTask(req.params.id, req.body.adminNotes);
  return res.json(task);
}

export async function rejectTask(req: Request, res: Response) {
  const task = await communityTaskService.rejectTask(req.params.id, req.body.reason);
  return res.json(task);
}

export async function flagTask(req: Request, res: Response) {
  const task = await communityTaskService.flagTask(req.params.id, req.body.adminNotes);
  return res.json(task);
}

export async function editTask(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  const task = await communityTaskService.editTask(req.params.id, req.body, userId);
  return res.json(task);
}
