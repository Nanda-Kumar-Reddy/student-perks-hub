/**
 * Vendor Service Service — business logic for vendor service management
 */
import { db } from "../../wrappers/databaseWrapper";
import { ServiceType } from "@prisma/client";

class VendorServiceService {
  async getVendorServices(userId: string) {
    const profile = await this.getProfile(userId);
    const services = await db.client.vendorService.findMany({
      where: { vendorId: profile.id },
      orderBy: { createdAt: "asc" },
    });
    return services.map((s) => ({
      id: s.id,
      serviceType: s.serviceType,
      isActive: s.isActive,
      createdAt: s.createdAt,
    }));
  }

  async addService(userId: string, serviceType: ServiceType) {
    const profile = await this.getProfile(userId);
    return db.client.vendorService.create({
      data: {
        vendorId: profile.id,
        serviceType,
      },
    });
  }

  async removeService(userId: string, serviceId: string) {
    const profile = await this.getProfile(userId);
    const service = await db.client.vendorService.findFirst({
      where: { id: serviceId, vendorId: profile.id },
    });
    if (!service) throw Object.assign(new Error("Service not found"), { statusCode: 404 });
    return db.client.vendorService.delete({ where: { id: serviceId } });
  }

  private async getProfile(userId: string) {
    let profile = await db.client.vendorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      profile = await db.client.vendorProfile.create({
        data: { userId },
        select: { id: true },
      });
    }
    return profile;
  }
}

export const vendorServiceService = new VendorServiceService();
