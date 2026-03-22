/**
 * Admin Approval Service
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

class AdminApprovalService {
  // ── Get pending approvals ──────────────────────────
  async getPendingApprovals(page = 1, limit = 20, entityType?: string) {
    const where: any = { status: "pending_approval" };
    if (entityType) where.entityType = entityType;

    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      db.client.adminApproval.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          requester: {
            select: {
              email: true,
              profile: { select: { fullName: true } },
              vendorProfile: { select: { businessName: true } },
            },
          },
        },
      }),
      db.client.adminApproval.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Approve ────────────────────────────────────────
  async approve(adminUserId: string, approvalId: string, adminNotes?: string) {
    const approval = await db.client.adminApproval.findUnique({
      where: { id: approvalId },
    });
    if (!approval) throw Object.assign(new Error("Approval not found"), { statusCode: 404 });

    // Update approval record
    await db.client.adminApproval.update({
      where: { id: approvalId },
      data: {
        status: "approved",
        adminId: adminUserId,
        adminNotes,
      },
    });

    // Apply the approved action
    if (approval.entityType === "vendor_listing") {
      if (approval.actionType === "create_listing" || approval.actionType === "update_listing") {
        await db.client.vendorListing.update({
          where: { id: approval.entityId },
          data: {
            status: "approved",
            ...(approval.actionType === "update_listing" && approval.requestedData
              ? (approval.requestedData as any)
              : {}),
          },
        });
      } else if (approval.actionType === "delete_listing") {
        await db.client.vendorListing.delete({
          where: { id: approval.entityId },
        });
      }
    }

    // Notify requester
    await notifications.send({
      receiverId: approval.requestedBy,
      receiverRole: "vendor",
      title: "Approval Granted",
      message: `Your ${approval.actionType.replace(/_/g, " ")} request has been approved`,
      type: "success",
    });

    return { message: "Approved successfully" };
  }

  // ── Reject ─────────────────────────────────────────
  async reject(adminUserId: string, approvalId: string, reason: string) {
    const approval = await db.client.adminApproval.findUnique({
      where: { id: approvalId },
    });
    if (!approval) throw Object.assign(new Error("Approval not found"), { statusCode: 404 });

    await db.client.adminApproval.update({
      where: { id: approvalId },
      data: {
        status: "rejected",
        adminId: adminUserId,
        rejectionReason: reason,
      },
    });

    // If it was a listing creation, mark listing as rejected
    if (approval.entityType === "vendor_listing" && approval.actionType === "create_listing") {
      await db.client.vendorListing.update({
        where: { id: approval.entityId },
        data: { status: "rejected" },
      });
    }

    // Notify requester
    await notifications.send({
      receiverId: approval.requestedBy,
      receiverRole: "vendor",
      title: "Request Rejected",
      message: `Your ${approval.actionType.replace(/_/g, " ")} request was rejected. Reason: ${reason}`,
      type: "warning",
    });

    return { message: "Rejected" };
  }

  // ── Get all approvals (history) ────────────────────
  async getApprovalHistory(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      db.client.adminApproval.findMany({
        where: { status: { not: "pending_approval" } },
        skip: offset,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          requester: {
            select: {
              email: true,
              profile: { select: { fullName: true } },
              vendorProfile: { select: { businessName: true } },
            },
          },
          admin: {
            select: { email: true, profile: { select: { fullName: true } } },
          },
        },
      }),
      db.client.adminApproval.count({ where: { status: { not: "pending_approval" } } }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Admin: get vendor details with services ────────
  async getVendorDetails(vendorUserId: string) {
    const user = await db.client.user.findUnique({
      where: { id: vendorUserId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        vendorProfile: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            address: true,
            category: true,
            about: true,
            certifications: true,
            qualifications: true,
            expertise: true,
            services: {
              select: {
                id: true,
                serviceType: true,
                isActive: true,
                adminEnabled: true,
                _count: { select: { listings: true } },
              },
            },
          },
        },
        profile: { select: { fullName: true, avatarUrl: true } },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!user) throw Object.assign(new Error("Vendor not found"), { statusCode: 404 });

    // Aggregate revenue
    const revenue: any[] = await db.client.$queryRaw`
      SELECT COALESCE(SUM(amount), 0)::float AS total
      FROM transactions
      WHERE vendor_id = ${vendorUserId}::uuid AND status = 'completed'
    `;

    // Customers served
    const customers: any[] = await db.client.$queryRaw`
      SELECT COUNT(DISTINCT user_id)::int AS count
      FROM transactions
      WHERE vendor_id = ${vendorUserId}::uuid AND status = 'completed'
    `;

    return {
      ...user,
      totalRevenue: revenue[0]?.total ?? 0,
      customersServed: customers[0]?.count ?? 0,
      startDate: user.createdAt,
      durationDays: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    };
  }
}

export const adminApprovalService = new AdminApprovalService();
