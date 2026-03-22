/**
 * Vendor Listing Service — CRUD for vendor listings with admin approval
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

class VendorListingService {
  // ── Create listing (goes to admin approval) ───────
  async createListing(vendorUserId: string, vendorProfileId: string, data: {
    vendorServiceId: string;
    serviceType: string;
    title: string;
    description?: string;
    price?: number;
    imageUrls?: string[];
    metadata?: any;
  }) {
    // Create listing as pending
    const listing = await db.client.vendorListing.create({
      data: {
        vendorServiceId: data.vendorServiceId,
        vendorId: vendorProfileId,
        serviceType: data.serviceType as any,
        title: data.title,
        description: data.description,
        price: data.price,
        imageUrls: data.imageUrls || [],
        metadata: data.metadata || {},
        status: "pending_approval",
      },
    });

    // Create admin approval request
    await db.client.adminApproval.create({
      data: {
        entityType: "vendor_listing",
        entityId: listing.id,
        actionType: "create_listing",
        requestedBy: vendorUserId,
        requestedData: data as any,
      },
    });

    // Notify admins
    const admins = await db.client.userRole.findMany({
      where: { role: "admin" },
      select: { userId: true },
    });
    for (const admin of admins) {
      await notifications.send({
        receiverId: admin.userId,
        receiverRole: "admin",
        title: "New Listing Pending Approval",
        message: `Vendor submitted a new ${data.serviceType} listing: "${data.title}"`,
        type: "info",
      });
    }

    return listing;
  }

  // ── Update listing (goes to admin approval) ────────
  async updateListing(vendorUserId: string, vendorProfileId: string, listingId: string, data: any) {
    const listing = await db.client.vendorListing.findFirst({
      where: { id: listingId, vendorId: vendorProfileId },
    });
    if (!listing) throw Object.assign(new Error("Listing not found"), { statusCode: 404 });

    // Create approval request for the update
    await db.client.adminApproval.create({
      data: {
        entityType: "vendor_listing",
        entityId: listingId,
        actionType: "update_listing",
        requestedBy: vendorUserId,
        requestedData: data,
        status: "pending_approval",
      },
    });

    // Notify admins
    const admins = await db.client.userRole.findMany({
      where: { role: "admin" },
      select: { userId: true },
    });
    for (const admin of admins) {
      await notifications.send({
        receiverId: admin.userId,
        receiverRole: "admin",
        title: "Listing Update Pending",
        message: `Vendor requested update for listing: "${listing.title}"`,
        type: "info",
      });
    }

    return { message: "Update submitted for admin approval" };
  }

  // ── Delete listing (goes to admin approval) ────────
  async requestDeleteListing(vendorUserId: string, vendorProfileId: string, listingId: string) {
    const listing = await db.client.vendorListing.findFirst({
      where: { id: listingId, vendorId: vendorProfileId },
    });
    if (!listing) throw Object.assign(new Error("Listing not found"), { statusCode: 404 });

    await db.client.adminApproval.create({
      data: {
        entityType: "vendor_listing",
        entityId: listingId,
        actionType: "delete_listing",
        requestedBy: vendorUserId,
        status: "pending_approval",
      },
    });

    const admins = await db.client.userRole.findMany({
      where: { role: "admin" },
      select: { userId: true },
    });
    for (const admin of admins) {
      await notifications.send({
        receiverId: admin.userId,
        receiverRole: "admin",
        title: "Listing Deletion Request",
        message: `Vendor requested deletion of listing: "${listing.title}"`,
        type: "warning",
      });
    }

    return { message: "Deletion submitted for admin approval" };
  }

  // ── Get vendor's listings ──────────────────────────
  async getVendorListings(vendorProfileId: string, serviceType?: string, page = 1, limit = 20) {
    const where: any = { vendorId: vendorProfileId };
    if (serviceType) where.serviceType = serviceType;

    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      db.client.vendorListing.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.client.vendorListing.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get approved public listings ───────────────────
  async getPublicListings(serviceType: string, page = 1, limit = 20) {
    const where = {
      serviceType: serviceType as any,
      status: "approved" as const,
      isActive: true,
    };

    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      db.client.vendorListing.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.client.vendorListing.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get single listing ─────────────────────────────
  async getListing(listingId: string) {
    return db.client.vendorListing.findUnique({
      where: { id: listingId },
    });
  }
}

export const vendorListingService = new VendorListingService();
