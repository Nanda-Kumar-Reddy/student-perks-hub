/**
 * Vendor Request Controller — manages incoming service requests
 */
import { Request, Response } from "express";
import { vendorRequestService } from "../../services/vendor/vendorRequestService";

export async function getRequests(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const serviceType = req.query.serviceType as string | undefined;
  const status = req.query.status as string | undefined;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const result = await vendorRequestService.getRequests(userId, { serviceType, status, page, limit });
  return res.json(result);
}

export async function approveRequest(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { sessionLink, contactDetails } = req.body;
  const result = await vendorRequestService.approveRequest(userId, req.params.id, { sessionLink, contactDetails });
  return res.json(result);
}

export async function rejectRequest(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { reason } = req.body;
  if (!reason) {
    return res.status(400).json({ error: "Rejection reason is required" });
  }
  const result = await vendorRequestService.rejectRequest(userId, req.params.id, reason);
  return res.json(result);
}

export async function acceptAirportPickup(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await vendorRequestService.acceptAirportPickup(userId, req.params.id);
  return res.json(result);
}
