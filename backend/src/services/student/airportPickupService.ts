/**
 * Airport Pickup Service
 */
import { db } from "../wrappers/databaseWrapper";
import { notifications } from "../wrappers/notificationWrapper";

export interface AirportPickupInput {
  flightNumber: string;
  arrivalDate: string;
  arrivalTime: string;
  airport: string;
  destination: string;
  passengers?: number;
  notes?: string;
}

class AirportPickupService {
  async create(userId: string, input: AirportPickupInput) {
    const pickup = await db.create("AirportPickup", {
      userId,
      flightNumber: input.flightNumber,
      arrivalDate: new Date(input.arrivalDate),
      arrivalTime: input.arrivalTime,
      airport: input.airport,
      destination: input.destination,
      passengers: input.passengers ?? 1,
      notes: input.notes,
    });

    await notifications.notifyAdmins(
      "New Airport Pickup Request",
      `Student requested airport pickup: Flight ${input.flightNumber} at ${input.airport}`,
      "booking"
    );

    console.log(`[AIRPORT_PICKUP] Created request ${pickup.id} by user ${userId}`);
    return pickup;
  }

  async getMyRequests(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("AirportPickup", { userId }, { page, limit });
  }
}

export const airportPickupService = new AirportPickupService();
