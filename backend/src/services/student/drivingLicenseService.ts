/**
 * Driving License Booking Service
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

export interface DrivingLicenseInput {
  licenseType: string;
  preferredDate?: string;
  notes?: string;
}

class DrivingLicenseService {
  async book(userId: string, input: DrivingLicenseInput) {
    const booking = await db.create("DrivingLicenseBooking", {
      userId,
      licenseType: input.licenseType,
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
      notes: input.notes,
    });

    await notifications.notifyAdmins(
      "New Driving License Booking",
      `Student booked driving license: ${input.licenseType}`,
      "booking"
    );

    console.log(`[DRIVING_LICENSE] Booking ${booking.id} by user ${userId}`);
    return booking;
  }

  async getMyBookings(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("DrivingLicenseBooking", { userId }, { page, limit });
  }
}

export const drivingLicenseService = new DrivingLicenseService();
