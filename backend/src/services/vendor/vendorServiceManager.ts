/**
 * Vendor Service Management Service
 */
import { db } from "../../wrappers/databaseWrapper";

class VendorServiceManager {
  // ── Get vendor's active services ──────────────────
  async getVendorServices(vendorProfileId: string) {
    return db.client.vendorService.findMany({
      where: { vendorId: vendorProfileId },
      orderBy: { createdAt: "asc" },
    });
  }

  // ── Add a service ────────────────────────────────
  async addService(vendorProfileId: string, serviceType: string) {
    return db.client.vendorService.create({
      data: {
        vendorId: vendorProfileId,
        serviceType: serviceType as any,
      },
    });
  }

  // ── Remove a service ─────────────────────────────
  async removeService(vendorProfileId: string, serviceId: string) {
    const service = await db.client.vendorService.findFirst({
      where: { id: serviceId, vendorId: vendorProfileId },
    });
    if (!service) throw Object.assign(new Error("Service not found"), { statusCode: 404 });
    return db.client.vendorService.delete({ where: { id: serviceId } });
  }

  // ── Toggle service active status ──────────────────
  async toggleService(vendorProfileId: string, serviceId: string, isActive: boolean) {
    const service = await db.client.vendorService.findFirst({
      where: { id: serviceId, vendorId: vendorProfileId },
    });
    if (!service) throw Object.assign(new Error("Service not found"), { statusCode: 404 });
    return db.client.vendorService.update({
      where: { id: serviceId },
      data: { isActive },
    });
  }

  // ── Admin: enable/disable service for a vendor ────
  async adminToggleService(vendorProfileId: string, serviceId: string, adminEnabled: boolean) {
    return db.client.vendorService.update({
      where: { id: serviceId },
      data: { adminEnabled },
    });
  }

  async adminAddServiceForVendor(vendorProfileId: string, serviceType: string) {
    return db.client.vendorService.upsert({
      where: {
        vendorId_serviceType: {
          vendorId: vendorProfileId,
          serviceType: serviceType as any,
        },
      },
      create: {
        vendorId: vendorProfileId,
        serviceType: serviceType as any,
        adminEnabled: true,
      },
      update: {
        adminEnabled: true,
        isActive: true,
      },
    });
  }

  async adminRemoveServiceForVendor(vendorProfileId: string, serviceType: string) {
    const service = await db.client.vendorService.findFirst({
      where: { vendorId: vendorProfileId, serviceType: serviceType as any },
    });
    if (!service) throw Object.assign(new Error("Service not found"), { statusCode: 404 });
    return db.client.vendorService.update({
      where: { id: service.id },
      data: { adminEnabled: false },
    });
  }
}

export const vendorServiceManager = new VendorServiceManager();
