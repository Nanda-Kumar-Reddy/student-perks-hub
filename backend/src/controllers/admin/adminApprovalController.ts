/**
 * Admin Approval Controller — manages the global approval workflow
 */
import { Request, Response } from "express";
import { adminApprovalService } from "../../services/admin/adminApprovalService";

export async function getPendingApprovals(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const entityType = req.query.entityType as string | undefined;
  const result = await adminApprovalService.getPendingApprovals({ page, limit, entityType });
  return res.json(result);
}

export async function approveItem(req: Request, res: Response) {
  const adminId = (req as any).user.userId;
  const result = await adminApprovalService.approve(req.params.id, adminId);
  return res.json(result);
}

export async function rejectItem(req: Request, res: Response) {
  const adminId = (req as any).user.userId;
  const { reason } = req.body;
  if (!reason) {
    return res.status(400).json({ error: "Rejection reason is required" });
  }
  const result = await adminApprovalService.reject(req.params.id, adminId, reason);
  return res.json(result);
}

export async function getVendorDetails(req: Request, res: Response) {
  const result = await adminApprovalService.getVendorDetails(req.params.id);
  return res.json(result);
}

export async function addVendorService(req: Request, res: Response) {
  const { serviceType } = req.body;
  const result = await adminApprovalService.addVendorService(req.params.id, serviceType);
  return res.status(201).json(result);
}

export async function removeVendorService(req: Request, res: Response) {
  const result = await adminApprovalService.removeVendorService(req.params.id, req.params.serviceId);
  return res.json(result);
}
