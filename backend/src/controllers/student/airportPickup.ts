/**
 * Airport Pickup Controller
 */
import { Request, Response } from "express";
import { airportPickupService } from "../../services/student/airportPickupService";

export async function createAirportPickup(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await airportPickupService.create(userId, req.body);
  return res.status(201).json(result);
}

export async function getMyAirportPickups(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await airportPickupService.getMyRequests(userId, page, limit);
  return res.json(result);
}
