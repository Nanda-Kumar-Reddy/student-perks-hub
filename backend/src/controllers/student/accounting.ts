/**
 * Accounting Controller
 */
import { Request, Response } from "express";
import { accountingService } from "../services/accountingService";

export async function bookAccounting(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await accountingService.book(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyAccountingBookings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await accountingService.getMyBookings(userId, page, limit);
  return res.json(result);
}
