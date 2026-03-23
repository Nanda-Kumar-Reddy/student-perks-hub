/**
 * Vendor Listing Service — business logic for vendor listings with approval workflow
 */
import { db } from "../../wrappers/databaseWrapper";
import { ServiceType } from "@prisma/client";

class VendorListingService {
  async getListings(userId: string, serviceType: string | undefined, page: number, limit: number) {
    const profile = await this.getProfile(userId);
    const where: any = { vendorId: profile.id };
    if (serviceType) where.serviceType = serviceType;

    const offset = (page - 1) * limit;
    const [listings, total] = await Promise.all([
      db.client.vendorListing.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.client.vendorListing.count({ where }),
    ]);

    return {
      data: listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createListing(userId: string, data: {
    serviceType: ServiceType;
    title: string;
    description?: string;
    price?: number;
    imageUrls?: string[];
    metadata?: any;
  }) {
    const profile = await this.getProfile(userId);
    
    // Ensure vendor has this service
    const vendorService = await db.client.vendorService.findFirst({
      where: { vendorId: profile.id, serviceType: data.serviceType },
    });
    if (!vendorService) {
      throw Object.assign(new Error("Service not enabled for this vendor"), { statusCode: 403 });
    }

    // Create listing with PENDING approval
    const listing = await db.client.vendorListing.create({
      data: {
        vendorServiceId: vendorService.id,
        vendorId: profile.id,
        serviceType: data.serviceType,
        title: data.title,
        description: data.description,
        price: data.price,
        imageUrls: data.imageUrls || [],
        metadata: data.metadata,
        approvalStatus: "PENDING",
        isActive: false,
      },
    });

    // Create admin approval request
    await db.client.adminApproval.create({
      data: {
        entityType: "vendor_listing",
        entityId: listing.id,
        action: "CREATE",
        requestedBy: userId,
        newData: data as any,
      },
    });

    // Notify admins
    await this.notifyAdmins(
      "New Listing Pending Approval",
      `Vendor submitted a new ${data.serviceType} listing: "${data.title}"`,
      "booking"
    );

    return listing;
  }

  async updateListing(userId: string, listingId: string, data: any) {
    const profile = await this.getProfile(userId);
    const listing = await db.client.vendorListing.findFirst({
      where: { id: listingId, vendorId: profile.id },
    });
    if (!listing) throw Object.assign(new Error("Listing not found"), { statusCode: 404 });

    // Create approval request for update
    await db.client.adminApproval.create({
      data: {
        entityType: "vendor_listing",
        entityId: listingId,
        action: "UPDATE",
        requestedBy: userId,
        previousData: listing as any,
        newData: data,
      },
    });

    await this.notifyAdmins(
      "Listing Update Pending",
      `Vendor requested to update listing: "${listing.title}"`,
      "info"
    );

    return { message: "Update request submitted for approval" };
  }

  async deleteListing(userId: string, listingId: string) {
    const profile = await this.getProfile(userId);
    const listing = await db.client.vendorListing.findFirst({
      where: { id: listingId, vendorId: profile.id },
    });
    if (!listing) throw Object.assign(new Error("Listing not found"), { statusCode: 404 });

    await db.client.adminApproval.create({
      data: {
        entityType: "vendor_listing",
        entityId: listingId,
        action: "DELETE",
        requestedBy: userId,
        previousData: listing as any,
      },
    });

    await this.notifyAdmins(
      "Listing Deletion Pending",
      `Vendor requested to delete listing: "${listing.title}"`,
      "warning"
    );

    return { message: "Delete request submitted for approval" };
  }

  private async getProfile(userId: string) {
    const profile = await db.client.vendorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) throw Object.assign(new Error("Vendor profile not found"), { statusCode: 404 });
    return profile;
  }

  private async notifyAdmins(title: string, message: string, type: string) {
    const admins = await db.client.userRole.findMany({
      where: { role: "admin" },
      select: { userId: true },
    });
    if (admins.length > 0) {
      await db.client.notification.createMany({
        data: admins.map((a) => ({
          receiverId: a.userId,
          receiverRole: "admin" as const,
          title,
          message,
          type: type as any,
        })),
      });
    }
  }
}

export const vendorListingService = new VendorListingService();
