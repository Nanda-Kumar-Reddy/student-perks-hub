/**
 * Event Registration Service
 */
import { db } from "../wrappers/databaseWrapper";
import { notifications } from "../wrappers/notificationWrapper";

export interface EventRegistrationInput {
  eventId: string;
  notes?: string;
}

class EventService {
  async register(userId: string, input: EventRegistrationInput) {
    const registration = await db.create("EventRegistration", {
      userId,
      eventId: input.eventId,
      notes: input.notes,
    });

    await notifications.notifyAdmins(
      "New Event Registration",
      `Student registered for event ${input.eventId}`,
      "booking"
    );

    console.log(`[EVENT] Registration ${registration.id} by user ${userId}`);
    return registration;
  }

  async getMyRegistrations(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("EventRegistration", { userId }, { page, limit });
  }
}

export const eventService = new EventService();
