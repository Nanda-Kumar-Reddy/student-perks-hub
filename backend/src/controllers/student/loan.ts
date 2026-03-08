/**
 * Loan Controller
 */
import { Request, Response } from "express";
import { loanApplicationService } from "../services/loanService";

export async function applyForLoan(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await loanApplicationService.apply(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyLoanApplications(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await loanApplicationService.getMyApplications(userId, page, limit);
  return res.json(result);
}
