/**
 * Admin Approval Controller
 */
import { Request, Response } from "express";
import { adminApprovalService } from "../../services/admin/adminApprovalService";
import { vendorServiceManager } from "../../services/vendor/vendorServiceManager";

// ── Approvals ────────────────────────────────────────

export async function getPendingApprovals(req: Request, res: Response) {
  const { page, limit, entityType } = req.query as any;
  const result = await adminApprovalService.getPendingApprovals(
    Math.max(1, parseInt(page) || 1),
    Math.min(100, Math.max(1, parseInt(limit) || 20)),
    entityType
  );
  return res.json(result);
}

export async function approveAction(req: Request, res: Response) {
  const adminUserId = (req as any).user.userId;
  const result = await adminApprovalService.approve(adminUserId, req.params.id, req.body.adminNotes);
  return res.json(result);
}

export async function rejectAction(req: Request, res: Response) {
  const adminUserId = (req as any).user.userId;
  const result = await adminApprovalService.reject(adminUserId, req.params.id, req.body.reason);
  return res.json(result);
}

export async function getApprovalHistory(req: Request, res: Response) {
  const { page, limit } = req.query as any;
  const result = await adminApprovalService.getApprovalHistory(
    Math.max(1, parseInt(page) || 1),
    Math.min(100, Math.max(1, parseInt(limit) || 20))
  );
  return res.json(result);
}

// ── Vendor Details ───────────────────────────────────

export async function getVendorDetails(req: Request, res: Response) {
  const result = await adminApprovalService.getVendorDetails(req.params.id);
  return res.json(result);
}

// ── Admin Service Control ────────────────────────────

export async function addServiceForVendor(req: Request, res: Response) {
  const { vendorProfileId, serviceType } = req.body;
  const result = await vendorServiceManager.adminAddServiceForVendor(vendorProfileId, serviceType);
  return res.json(result);
}

export async function removeServiceForVendor(req: Request, res: Response) {
  const { vendorProfileId, serviceType } = req.body;
  const result = await vendorServiceManager.adminRemoveServiceForVendor(vendorProfileId, serviceType);
  return res.json(result);
}
