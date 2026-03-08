/**
 * Certification Request Service
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

export interface CertificationRequestInput {
  certificationName: string;
  notes?: string;
}

class CertificationService {
  async request(userId: string, input: CertificationRequestInput) {
    const cert = await db.create("CertificationRequest", {
      userId,
      certificationName: input.certificationName,
      notes: input.notes,
    });

    await notifications.notifyAdmins(
      "New Certification Request",
      `Student requested certification: ${input.certificationName}`,
      "application"
    );

    console.log(`[CERTIFICATION] Request ${cert.id} by user ${userId}`);
    return cert;
  }

  async getMyRequests(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("CertificationRequest", { userId }, { page, limit });
  }
}

export const certificationService = new CertificationService();
