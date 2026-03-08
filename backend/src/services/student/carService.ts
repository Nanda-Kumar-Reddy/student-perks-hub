/**
 * Car Rent/Sale Request Service
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

export interface CarRequestInput {
  carTitle: string;
  vendorId?: string;
  type: string; // "rent" | "sale"
  message?: string;
  startDate?: string;
  endDate?: string;
}

class CarService {
  async createRequest(userId: string, input: CarRequestInput) {
    const request = await db.create("CarRentRequest", {
      userId,
      carTitle: input.carTitle,
      vendorId: input.vendorId,
      type: input.type,
      message: input.message,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
    });

    await notifications.notifyAdmins(
      "New Car Request",
      `Student requested car ${input.type}: ${input.carTitle}`,
      "enquiry"
    );

    if (input.vendorId) {
      await notifications.send({
        receiverId: input.vendorId,
        receiverRole: "vendor",
        title: "New Car Enquiry",
        message: `A student is interested in: ${input.carTitle}`,
        type: "enquiry",
      });
    }

    console.log(`[CAR] Request ${request.id} by user ${userId}`);
    return request;
  }

  async getMyRequests(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("CarRentRequest", { userId }, { page, limit });
  }
}

export const carService = new CarService();
