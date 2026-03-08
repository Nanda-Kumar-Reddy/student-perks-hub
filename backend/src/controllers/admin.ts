/**
 * Admin Controller — thin, delegates to adminService
 */
import { Request, Response } from "express";
import { adminService } from "../services/adminService";

export async function getDashboard(_req: Request, res: Response) {
  const stats = await adminService.getDashboardStats();
  return res.json(stats);
}

export async function getUsers(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

  const result = await adminService.getUsers(page, limit);
  return res.json(result);
}

export async function getVendors(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const status = req.query.status as string | undefined;

  const result = await adminService.getVendors(page, limit, status);
  return res.json(result);
}

export async function approveVendor(req: Request, res: Response) {
  await adminService.approveVendor(req.params.id);
  return res.json({ message: "Vendor approved" });
}

export async function rejectVendor(req: Request, res: Response) {
  await adminService.rejectVendor(req.params.id);
  return res.json({ message: "Vendor rejected" });
}

export async function getTransactions(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

  const result = await adminService.getTransactions(page, limit);
  return res.json(result);
}

export async function getRevenueAnalytics(req: Request, res: Response) {
  const mode = (req.query.mode as string) === "yearly" ? "yearly" : "monthly";
  const result = await adminService.getRevenueAnalytics(mode);
  return res.json(result);
}

export async function getUserAnalytics(_req: Request, res: Response) {
  const result = await adminService.getUserRegistrationAnalytics();
  return res.json(result);
}

export async function getVendorAnalytics(_req: Request, res: Response) {
  const result = await adminService.getVendorRegistrationAnalytics();
  return res.json(result);
}

export async function getCategoryDistribution(_req: Request, res: Response) {
  const result = await adminService.getCategoryDistribution();
  return res.json(result);
}
