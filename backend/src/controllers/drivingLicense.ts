/**
 * Driving License Controller
 */
import { Request, Response } from "express";
import { drivingLicenseService } from "../services/drivingLicenseService";

export async function bookDrivingLicense(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await drivingLicenseService.book(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyDrivingLicenseBookings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await drivingLicenseService.getMyBookings(userId, page, limit);
  return res.json(result);
}
