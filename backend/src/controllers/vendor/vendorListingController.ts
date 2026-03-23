/**
 * Vendor Listing Controller — manages listings within services
 */
import { Request, Response } from "express";
import { vendorListingService } from "../../services/vendor/vendorListingService";

export async function getListings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const serviceType = req.query.serviceType as string;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const result = await vendorListingService.getListings(userId, serviceType, page, limit);
  return res.json(result);
}

export async function createListing(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const listing = await vendorListingService.createListing(userId, req.body);
  return res.status(201).json(listing);
}

export async function updateListing(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await vendorListingService.updateListing(userId, req.params.id, req.body);
  return res.json(result);
}

export async function deleteListing(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  await vendorListingService.deleteListing(userId, req.params.id);
  return res.json({ message: "Delete request submitted for approval" });
}
