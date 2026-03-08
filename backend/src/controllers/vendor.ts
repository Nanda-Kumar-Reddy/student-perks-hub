/**
 * Vendor Controller — thin, delegates to vendorService
 */
import { Request, Response } from "express";
import { vendorService } from "../services/vendorService";

export async function getDashboard(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const stats = await vendorService.getDashboardStats(profileId);
  return res.json(stats);
}

export async function getTransactions(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

  const result = await vendorService.getTransactions(userId, page, limit);
  return res.json(result);
}

export async function createCoupon(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const coupon = await vendorService.createCoupon(profileId, req.body);
  return res.status(201).json(coupon);
}

export async function getCoupons(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

  const result = await vendorService.getCoupons(profileId, page, limit);
  return res.json(result);
}

export async function deleteCoupon(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  await vendorService.deleteCoupon(profileId, req.params.id);
  return res.json({ message: "Coupon deleted" });
}

export async function getRevenueAnalytics(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const mode = (req.query.mode as string) === "yearly" ? "yearly" : "monthly";
  const result = await vendorService.getRevenueAnalytics(userId, mode);
  return res.json(result);
}

export async function getCustomerVisits(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await vendorService.getCustomerVisitAnalytics(userId);
  return res.json(result);
}

export async function getRatingTrend(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const result = await vendorService.getRatingTrend(profileId);
  return res.json(result);
}

export async function getCouponUsage(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const result = await vendorService.getCouponUsageAnalytics(profileId);
  return res.json(result);
}

export async function getSettings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await vendorService.getSettings(userId);
  return res.json(result);
}

export async function updateSettings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  await vendorService.updateSettings(userId, req.body);
  return res.json({ message: "Settings updated" });
}
