/**
 * Vendor Service Controller — manages vendor services (add/remove/list)
 */
import { Request, Response } from "express";
import { vendorServiceService } from "../../services/vendor/vendorServiceService";

export async function getMyServices(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const services = await vendorServiceService.getVendorServices(userId);
  return res.json({ data: services });
}

export async function addService(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { serviceType } = req.body;
  const service = await vendorServiceService.addService(userId, serviceType);
  return res.status(201).json(service);
}

export async function removeService(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  await vendorServiceService.removeService(userId, req.params.id);
  return res.json({ message: "Service removed" });
}
