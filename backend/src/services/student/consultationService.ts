/**
 * Consultation Booking Service
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

export interface ConsultationInput {
  consultantId?: string;
  vendorId?: string;
  topic: string;
  message?: string;
  date?: string;
  timeSlot?: string;
}

class ConsultationService {
  async book(userId: string, input: ConsultationInput) {
    const booking = await db.create("Consultation", {
      userId,
      consultantId: input.consultantId,
      vendorId: input.vendorId,
      topic: input.topic,
      message: input.message,
      date: input.date ? new Date(input.date) : null,
      timeSlot: input.timeSlot,
    });

    // Notify admin
    await notifications.notifyAdmins(
      "New Consultation Booking",
      `Student booked a consultation: ${input.topic}`,
      "booking"
    );

    // Notify vendor if applicable
    if (input.vendorId) {
      await notifications.send({
        receiverId: input.vendorId,
        receiverRole: "vendor",
        title: "New Consultation Booking",
        message: `A student booked a consultation with you: ${input.topic}`,
        type: "booking",
      });
    }

    console.log(`[CONSULTATION] Booking ${booking.id} by user ${userId}`);
    return booking;
  }

  async getMyBookings(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("Consultation", { userId }, { page, limit });
  }
}

export const consultationService = new ConsultationService();
