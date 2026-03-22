/**
 * Vendor Service Controller
 */
import { Request, Response } from "express";
import { vendorServiceManager } from "../../services/vendor/vendorServiceManager";
import { vendorListingService } from "../../services/vendor/vendorListingService";
import { vendorRequestService } from "../../services/vendor/vendorRequestService";
import { vendorService } from "../../services/vendor/vendorService";

// ── Services CRUD ────────────────────────────────────

export async function getMyServices(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const services = await vendorServiceManager.getVendorServices(profileId);
  return res.json({ data: services });
}

export async function addService(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const result = await vendorServiceManager.addService(profileId, req.body.serviceType);
  return res.status(201).json(result);
}

export async function removeService(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  await vendorServiceManager.removeService(profileId, req.params.id);
  return res.json({ message: "Service removed" });
}

export async function toggleService(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const result = await vendorServiceManager.toggleService(profileId, req.params.id, req.body.isActive);
  return res.json(result);
}

// ── Listings CRUD ────────────────────────────────────

export async function getMyListings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const { serviceType, page, limit } = req.query as any;
  const result = await vendorListingService.getVendorListings(
    profileId, serviceType,
    Math.max(1, parseInt(page) || 1),
    Math.min(100, Math.max(1, parseInt(limit) || 20))
  );
  return res.json(result);
}

export async function createListing(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const result = await vendorListingService.createListing(userId, profileId, req.body);
  return res.status(201).json(result);
}

export async function updateListing(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const result = await vendorListingService.updateListing(userId, profileId, req.params.id, req.body);
  return res.json(result);
}

export async function deleteListing(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const profileId = await vendorService.getVendorProfileId(userId);
  const result = await vendorListingService.requestDeleteListing(userId, profileId, req.params.id);
  return res.json(result);
}

export async function getPublicListings(req: Request, res: Response) {
  const { serviceType, page, limit } = req.query as any;
  const result = await vendorListingService.getPublicListings(
    serviceType,
    Math.max(1, parseInt(page) || 1),
    Math.min(100, Math.max(1, parseInt(limit) || 20))
  );
  return res.json(result);
}

// ── Requests ─────────────────────────────────────────

export async function getMyRequests(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { serviceType, status, page, limit } = req.query as any;
  const result = await vendorRequestService.getVendorRequests(
    userId, serviceType, status,
    Math.max(1, parseInt(page) || 1),
    Math.min(100, Math.max(1, parseInt(limit) || 20))
  );
  return res.json(result);
}

export async function getRequestHistory(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { serviceType, page, limit } = req.query as any;
  const result = await vendorRequestService.getVendorRequestHistory(
    userId, serviceType,
    Math.max(1, parseInt(page) || 1),
    Math.min(100, Math.max(1, parseInt(limit) || 20))
  );
  return res.json(result);
}

export async function approveRequest(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await vendorRequestService.approveRequest(userId, req.params.id, req.body.notes);
  return res.json(result);
}

export async function rejectRequest(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await vendorRequestService.rejectRequest(userId, req.params.id, req.body.reason);
  return res.json(result);
}

// ── Student creates request ──────────────────────────

export async function createStudentRequest(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await vendorRequestService.createRequest(userId, req.body);
  return res.status(201).json(result);
}

export async function getStudentServiceRequests(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await vendorRequestService.getStudentRequests(
    userId,
    Math.max(1, parseInt(page) || 1),
    Math.min(100, Math.max(1, parseInt(limit) || 20))
  );
  return res.json(result);
}
