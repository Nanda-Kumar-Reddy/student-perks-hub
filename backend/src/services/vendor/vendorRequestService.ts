/**
 * Vendor Request Service — handles student requests to vendors
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

class VendorRequestService {
  // ── Student submits request ────────────────────────
  async createRequest(studentId: string, data: {
    listingId?: string;
    vendorId: string;
    serviceType: string;
    message?: string;
    metadata?: any;
  }) {
    const request = await db.client.vendorRequest.create({
      data: {
        listingId: data.listingId,
        vendorId: data.vendorId,
        studentId,
        serviceType: data.serviceType as any,
        message: data.message,
        metadata: data.metadata || {},
      },
    });

    // Notify vendor
    await notifications.send({
      receiverId: data.vendorId,
      receiverRole: "vendor",
      title: "New Service Request",
      message: `A student has requested your ${data.serviceType.replace(/_/g, " ")} service`,
      type: "application",
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
        title: "New Service Request",
        message: `Student submitted a ${data.serviceType.replace(/_/g, " ")} request`,
        type: "info",
      });
    }

    return request;
  }

  // ── Vendor approves request ────────────────────────
  async approveRequest(vendorUserId: string, requestId: string, vendorNotes?: string) {
    const req = await db.client.vendorRequest.findFirst({
      where: { id: requestId, vendorId: vendorUserId },
    });
    if (!req) throw Object.assign(new Error("Request not found"), { statusCode: 404 });

    const updated = await db.client.vendorRequest.update({
      where: { id: requestId },
      data: { status: "approved", vendorNotes },
    });

    // Notify student
    await notifications.send({
      receiverId: req.studentId,
      receiverRole: "student",
      title: "Request Approved",
      message: `Your ${req.serviceType.replace(/_/g, " ")} request has been approved!`,
      type: "success",
    });

    return updated;
  }

  // ── Vendor rejects request ─────────────────────────
  async rejectRequest(vendorUserId: string, requestId: string, reason: string) {
    const req = await db.client.vendorRequest.findFirst({
      where: { id: requestId, vendorId: vendorUserId },
    });
    if (!req) throw Object.assign(new Error("Request not found"), { statusCode: 404 });

    const updated = await db.client.vendorRequest.update({
      where: { id: requestId },
      data: { status: "rejected", rejectionReason: reason },
    });

    // Notify student with reason
    await notifications.send({
      receiverId: req.studentId,
      receiverRole: "student",
      title: "Request Rejected",
      message: `Your ${req.serviceType.replace(/_/g, " ")} request was rejected. Reason: ${reason}`,
      type: "warning",
    });

    return updated;
  }

  // ── Get vendor's requests ──────────────────────────
  async getVendorRequests(vendorUserId: string, serviceType?: string, status?: string, page = 1, limit = 20) {
    const where: any = { vendorId: vendorUserId };
    if (serviceType) where.serviceType = serviceType;
    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      db.client.vendorRequest.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          student: {
            select: {
              email: true,
              profile: { select: { fullName: true, phone: true, avatarUrl: true } },
            },
          },
          listing: { select: { title: true, serviceType: true } },
        },
      }),
      db.client.vendorRequest.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get vendor request history (approved/rejected) ──
  async getVendorRequestHistory(vendorUserId: string, serviceType?: string, page = 1, limit = 20) {
    const where: any = {
      vendorId: vendorUserId,
      status: { in: ["approved", "rejected", "completed"] },
    };
    if (serviceType) where.serviceType = serviceType;

    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      db.client.vendorRequest.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          student: {
            select: {
              email: true,
              profile: { select: { fullName: true, phone: true } },
            },
          },
          listing: { select: { title: true } },
        },
      }),
      db.client.vendorRequest.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get student's requests ─────────────────────────
  async getStudentRequests(studentId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      db.client.vendorRequest.findMany({
        where: { studentId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          listing: { select: { title: true, serviceType: true } },
        },
      }),
      db.client.vendorRequest.count({ where: { studentId } }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export const vendorRequestService = new VendorRequestService();
