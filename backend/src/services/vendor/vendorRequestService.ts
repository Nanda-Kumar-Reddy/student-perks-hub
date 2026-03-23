/**
 * Vendor Request Service — handles incoming student requests for vendor services
 */
import { db } from "../../wrappers/databaseWrapper";

class VendorRequestService {
  async getRequests(userId: string, params: {
    serviceType?: string;
    status?: string;
    page: number;
    limit: number;
  }) {
    const profile = await db.client.vendorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) throw Object.assign(new Error("Vendor profile not found"), { statusCode: 404 });

    const where: any = { vendorId: profile.id };
    if (params.serviceType) where.serviceType = params.serviceType;
    if (params.status) where.status = params.status;

    const offset = (params.page - 1) * params.limit;
    const [requests, total] = await Promise.all([
      db.client.vendorRequest.findMany({
        where,
        skip: offset,
        take: params.limit,
        orderBy: { createdAt: "desc" },
        include: {
          listing: { select: { title: true, serviceType: true } },
        },
      }),
      db.client.vendorRequest.count({ where }),
    ]);

    return {
      data: requests,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async approveRequest(userId: string, requestId: string, data?: { sessionLink?: string; contactDetails?: string }) {
    const profile = await db.client.vendorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) throw Object.assign(new Error("Vendor profile not found"), { statusCode: 404 });

    const request = await db.client.vendorRequest.findFirst({
      where: { id: requestId, vendorId: profile.id },
    });
    if (!request) throw Object.assign(new Error("Request not found"), { statusCode: 404 });

    const updated = await db.client.vendorRequest.update({
      where: { id: requestId },
      data: {
        status: "approved",
        metadata: data ? (data as any) : undefined,
      },
    });

    // Notify student
    await db.client.notification.create({
      data: {
        receiverId: request.studentId,
        receiverRole: "student",
        title: "Request Approved",
        message: `Your ${request.serviceType} request has been approved.`,
        type: "success",
      },
    });

    return updated;
  }

  async rejectRequest(userId: string, requestId: string, reason: string) {
    const profile = await db.client.vendorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) throw Object.assign(new Error("Vendor profile not found"), { statusCode: 404 });

    const request = await db.client.vendorRequest.findFirst({
      where: { id: requestId, vendorId: profile.id },
    });
    if (!request) throw Object.assign(new Error("Request not found"), { statusCode: 404 });

    const updated = await db.client.vendorRequest.update({
      where: { id: requestId },
      data: { status: "rejected", rejectReason: reason },
    });

    // Notify student with reason
    await db.client.notification.create({
      data: {
        receiverId: request.studentId,
        receiverRole: "student",
        title: "Request Rejected",
        message: `Your ${request.serviceType} request was rejected. Reason: ${reason}`,
        type: "error",
      },
    });

    return updated;
  }

  async acceptAirportPickup(userId: string, pickupId: string) {
    const pickup = await db.client.airportPickup.findUnique({ where: { id: pickupId } });
    if (!pickup) throw Object.assign(new Error("Pickup not found"), { statusCode: 404 });
    if (pickup.assignedVendorId) throw Object.assign(new Error("Already assigned"), { statusCode: 409 });

    const updated = await db.client.airportPickup.update({
      where: { id: pickupId },
      data: { assignedVendorId: userId, status: "approved" },
    });

    // Notify student
    await db.client.notification.create({
      data: {
        receiverId: pickup.userId,
        receiverRole: "student",
        title: "Airport Pickup Accepted",
        message: "A vendor has accepted your airport pickup request.",
        type: "success",
      },
    });

    return updated;
  }
}

export const vendorRequestService = new VendorRequestService();
