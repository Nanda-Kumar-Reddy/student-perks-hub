/**
 * Profile Service
 */
import { db } from "../wrappers/databaseWrapper";

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  address?: string;
  university?: string;
}

class ProfileService {
  async getMyProfile(userId: string) {
    const profile = await db.client.profile.findUnique({ where: { userId } });
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
}

export const profileService = new ProfileService();
