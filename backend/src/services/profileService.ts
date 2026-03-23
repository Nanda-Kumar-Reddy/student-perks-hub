/**
 * Profile Service — enhanced with tasks, history, verification
 */
import { db } from "../wrappers/databaseWrapper";

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  address?: string;
  university?: string;
  skills?: string[];
}

class ProfileService {
  async getMyProfile(userId: string) {
    const profile = await db.client.profile.findUnique({
      where: { userId },
      include: { user: { include: { roles: true } } },
    });
    if (!profile) {
      throw Object.assign(new Error("Profile not found"), { status: 404 });
    }
    return profile;
  }

  async updateMyProfile(userId: string, input: UpdateProfileInput) {
    return db.client.profile.update({
      where: { userId },
      data: input,
    });
  }

  async listProfiles(page: number = 1, limit: number = 20, sortBy?: string, sortOrder?: "asc" | "desc") {
    return db.findMany("Profile", {}, { page, limit, sortBy, sortOrder }, {
      user: { include: { roles: true } },
    });
  }

  async getMyActiveTasks(userId: string, page = 1, limit = 20) {
    return db.findMany("CommunityTask", {
      userId,
      status: { in: ["APPROVED", "PENDING_APPROVAL"] },
    }, { page, limit }, {
      _count: { select: { applications: true } },
    });
  }

  async getMyPendingApprovals(userId: string, page = 1, limit = 20) {
    return db.findMany("CommunityTask", {
      userId,
      status: "PENDING_APPROVAL",
    }, { page, limit });
  }

  async getMyTaskHistory(userId: string, page = 1, limit = 20) {
    return db.findMany("TaskHistory", { userId }, { page, limit, sortBy: "completedAt", sortOrder: "desc" });
  }
}

export const profileService = new ProfileService();
