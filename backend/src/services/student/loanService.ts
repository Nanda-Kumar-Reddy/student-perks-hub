/**
 * Loan Application Service
 */
import { db } from "../wrappers/databaseWrapper";
import { notifications } from "../wrappers/notificationWrapper";

export interface LoanApplicationInput {
  amount: number;
  purpose: string;
  description?: string;
}

class LoanApplicationService {
  async apply(userId: string, input: LoanApplicationInput) {
    const application = await db.create("LoanApplication", {
      userId,
      amount: input.amount,
      purpose: input.purpose,
      description: input.description,
    });

    await notifications.notifyAdmins(
      "New Loan Application",
      `Student applied for a loan of $${input.amount} — Purpose: ${input.purpose}`,
      "application"
    );

    console.log(`[LOAN] Application ${application.id} submitted by user ${userId}`);
    return application;
  }

  async getMyApplications(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("LoanApplication", { userId }, { page, limit });
  }
}

export const loanApplicationService = new LoanApplicationService();
