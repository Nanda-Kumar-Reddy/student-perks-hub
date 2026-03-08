/**
 * Car Controller
 */
import { Request, Response } from "express";
import { carService } from "../services/carService";

export async function createCarRequest(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await carService.createRequest(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyCarRequests(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await carService.getMyRequests(userId, page, limit);
  return res.json(result);
}
