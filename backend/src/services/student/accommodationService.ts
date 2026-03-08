/**
 * Accommodation Service
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

export interface AccommodationEnquiryInput {
  accommodationId: string;
  message: string;
  type: string; // "chat" | "enquiry"
}

class AccommodationService {
  async createEnquiry(userId: string, input: AccommodationEnquiryInput) {
    const enquiry = await db.create("AccommodationEnquiry", {
      userId,
      accommodationId: input.accommodationId,
      type: input.type,
      message: input.message,
    });

    const typeLabel = input.type === "chat" ? "Chat Request" : "Enquiry";
    await notifications.notifyAdmins(
      `New Accommodation ${typeLabel}`,
      `Student sent an accommodation ${typeLabel.toLowerCase()} for listing ${input.accommodationId}`,
      "enquiry"
    );

    console.log(`[ACCOMMODATION] ${typeLabel} ${enquiry.id} by user ${userId}`);
    return enquiry;
  }

  async getMyEnquiries(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("AccommodationEnquiry", { userId }, { page, limit });
  }
}

export const accommodationService = new AccommodationService();
