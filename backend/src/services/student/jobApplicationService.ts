/**
 * Job Application Service
 */
import { db } from "../wrappers/databaseWrapper";
import { storage } from "../wrappers/storageWrapper";
import { notifications } from "../wrappers/notificationWrapper";

export interface JobApplicationInput {
  jobId: string;
  coverLetter?: string;
}

class JobApplicationService {
  async apply(userId: string, input: JobApplicationInput, file?: Express.Multer.File) {
    let resumeUrl: string | null = null;

    if (file) {
      resumeUrl = await storage.uploadMulterFile(file, "resumes");
    }

    const application = await db.create("JobApplication", {
      userId,
      jobId: input.jobId,
      resumeUrl,
      coverLetter: input.coverLetter,
    });

    await notifications.notifyAdmins(
      "New Job Application",
      `Student applied for job ${input.jobId}`,
      "application"
    );

    console.log(`[JOB_APPLICATION] Application ${application.id} submitted by user ${userId}`);
    return application;
  }

  async getMyApplications(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("JobApplication", { userId }, { page, limit }, { job: true });
  }
}

export const jobApplicationService = new JobApplicationService();
