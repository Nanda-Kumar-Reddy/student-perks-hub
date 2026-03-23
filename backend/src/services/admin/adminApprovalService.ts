/**
 * Admin Approval Service — handles global approval workflow for vendor actions
 */
import { db } from "../../wrappers/databaseWrapper";
import { ServiceType } from "@prisma/client";

class AdminApprovalService {
  async getPendingApprovals(params: { page: number; limit: number; entityType?: string }) {
    const where: any = { status: "PENDING" };
    if (params.entityType) where.entityType = params.entityType;

    const offset = (params.page - 1) * params.limit;
    const [approvals, total] = await Promise.all([
      db.client.adminApproval.findMany({
        where,
        skip: offset,
        take: params.limit,
        orderBy: { createdAt: "desc" },
      }),
      db.client.adminApproval.count({ where }),
    ]);

    return {
      data: approvals,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async approve(approvalId: string, adminId: string) {
    const approval = await db.client.adminApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw Object.assign(new Error("Approval not found"), { statusCode: 404 });
    if (approval.status !== "PENDING") throw Object.assign(new Error("Already processed"), { statusCode: 409 });

    // Process the action
    if (approval.entityType === "vendor_listing") {
      await this.processListingApproval(approval);
    } else if (approval.entityType === "student_accommodation") {
      await this.processStudentAccommodationApproval(approval);
    } else if (approval.entityType === "community_task_edit") {
      await this.processCommunityTaskEditApproval(approval);
    }

    const updated = await db.client.adminApproval.update({
      where: { id: approvalId },
      data: { status: "APPROVED", reviewedBy: adminId, reviewedAt: new Date() },
    });

    // Notify the requester
    await db.client.notification.create({
      data: {
        receiverId: approval.requestedBy,
        receiverRole: "vendor",
        title: "Request Approved",
        message: `Your ${approval.entityType} ${approval.action.toLowerCase()} request has been approved.`,
        type: "success",
      },
    });

    return updated;
  }

  async reject(approvalId: string, adminId: string, reason: string) {
    const approval = await db.client.adminApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw Object.assign(new Error("Approval not found"), { statusCode: 404 });
    if (approval.status !== "PENDING") throw Object.assign(new Error("Already processed"), { statusCode: 409 });

    const updated = await db.client.adminApproval.update({
      where: { id: approvalId },
      data: { status: "REJECTED", reviewedBy: adminId, reviewedAt: new Date(), reason },
    });

    await db.client.notification.create({
      data: {
        receiverId: approval.requestedBy,
        receiverRole: "vendor",
        title: "Request Rejected",
        message: `Your ${approval.entityType} ${approval.action.toLowerCase()} request was rejected. Reason: ${reason}`,
        type: "error",
      },
    });

    return updated;
  }

  async getVendorDetails(vendorUserId: string) {
    const client = db.client;
    const user = await client.user.findUnique({
      where: { id: vendorUserId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        vendorStatus: true,
        profile: { select: { fullName: true, avatarUrl: true } },
        vendorProfile: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            address: true,
            category: true,
            services: {
              select: { id: true, serviceType: true, isActive: true, createdAt: true },
            },
          },
        },
        _count: { select: { transactions: true } },
        transactions: {
          where: { status: "completed" },
          select: { amount: true },
        },
      },
    });

    if (!user) throw Object.assign(new Error("Vendor not found"), { statusCode: 404 });

    const now = new Date();
    return {
      id: user.id,
      name: user.profile?.fullName || user.email,
      email: user.email,
      businessName: user.vendorProfile?.businessName,
      startDate: user.createdAt,
      durationDays: Math.floor((now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      customersServed: user._count.transactions,
      totalTransactions: user._count.transactions,
      revenue: user.transactions.reduce((sum, t) => sum + Number(t.amount), 0),
      services: user.vendorProfile?.services || [],
      vendorProfileId: user.vendorProfile?.id,
    };
  }

  async addVendorService(vendorUserId: string, serviceType: ServiceType) {
    const profile = await db.client.vendorProfile.findUnique({
      where: { userId: vendorUserId },
      select: { id: true },
    });
    if (!profile) {
      throw Object.assign(new Error("Vendor profile not found"), { statusCode: 404 });
    }

    const service = await db.client.vendorService.create({
      data: { vendorId: profile.id, serviceType },
    });

    // Notify vendor
    await db.client.notification.create({
      data: {
        receiverId: vendorUserId,
        receiverRole: "vendor",
        title: "New Service Enabled",
        message: `Admin has enabled ${serviceType} service for your account.`,
        type: "success",
      },
    });

    return service;
  }

  async removeVendorService(vendorUserId: string, serviceId: string) {
    const profile = await db.client.vendorProfile.findUnique({
      where: { userId: vendorUserId },
      select: { id: true },
    });
    if (!profile) throw Object.assign(new Error("Vendor profile not found"), { statusCode: 404 });

    const service = await db.client.vendorService.findFirst({
      where: { id: serviceId, vendorId: profile.id },
    });
    if (!service) throw Object.assign(new Error("Service not found"), { statusCode: 404 });

    await db.client.vendorService.delete({ where: { id: serviceId } });

    await db.client.notification.create({
      data: {
        receiverId: vendorUserId,
        receiverRole: "vendor",
        title: "Service Disabled",
        message: `Admin has disabled ${service.serviceType} service for your account.`,
        type: "warning",
      },
    });

    return { message: "Service removed" };
  }

  // ── Private approval processors ─────────────────────

  private async processListingApproval(approval: any) {
    if (approval.action === "CREATE") {
      await db.client.vendorListing.update({
        where: { id: approval.entityId },
        data: { approvalStatus: "APPROVED", isActive: true },
      });
    } else if (approval.action === "UPDATE" && approval.newData) {
      const updateData: any = { ...approval.newData, approvalStatus: "APPROVED" };
      delete updateData.serviceType;
      delete updateData.vendorServiceId;
      await db.client.vendorListing.update({
        where: { id: approval.entityId },
        data: updateData,
      });
    } else if (approval.action === "DELETE") {
      await db.client.vendorListing.delete({ where: { id: approval.entityId } });
    }
  }

  private async processStudentAccommodationApproval(approval: any) {
    if (approval.action === "CREATE") {
      await db.client.studentAccommodation.update({
        where: { id: approval.entityId },
        data: { approvalStatus: "APPROVED", isActive: true },
      });
    } else if (approval.action === "UPDATE" && approval.newData) {
      await db.client.studentAccommodation.update({
        where: { id: approval.entityId },
        data: { ...approval.newData, approvalStatus: "APPROVED" },
      });
    } else if (approval.action === "DELETE") {
      await db.client.studentAccommodation.delete({ where: { id: approval.entityId } });
    }
  }

  private async processCommunityTaskEditApproval(approval: any) {
    if (approval.action === "UPDATE" && approval.newData) {
      await db.client.communityTask.update({
        where: { id: approval.entityId },
        data: approval.newData,
      });
    }
  }
}

export const adminApprovalService = new AdminApprovalService();
