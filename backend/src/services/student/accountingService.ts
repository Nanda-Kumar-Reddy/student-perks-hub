/**
 * Accounting Booking Service
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

export interface AccountingBookingInput {
  vendorId?: string;
  service: string;
  message?: string;
  date?: string;
  timeSlot?: string;
}

class AccountingService {
  async book(userId: string, input: AccountingBookingInput) {
    const booking = await db.create("AccountingBooking", {
      userId,
      vendorId: input.vendorId,
      service: input.service,
      message: input.message,
      date: input.date ? new Date(input.date) : null,
      timeSlot: input.timeSlot,
    });

    await notifications.notifyAdmins(
      "New Accounting Booking",
      `Student booked accounting service: ${input.service}`,
      "booking"
    );

    if (input.vendorId) {
      await notifications.send({
        receiverId: input.vendorId,
        receiverRole: "vendor",
        title: "New Accounting Booking",
        message: `A student booked your accounting service: ${input.service}`,
        type: "booking",
      });
    }

    console.log(`[ACCOUNTING] Booking ${booking.id} by user ${userId}`);
    return booking;
  }

  async getMyBookings(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("AccountingBooking", { userId }, { page, limit });
  }
}

export const accountingService = new AccountingService();
