/**
 * Admin Service — all business logic & database queries for admin portal
 */
import { db } from "../wrappers/databaseWrapper";

class AdminService {
  // ── Dashboard Aggregates ─────────────────────────────

  async getDashboardStats() {
    const client = db.client;

    const [
      totalStudents,
      totalVendors,
      todayTransactions,
      pendingApprovals,
      topVendorApprovals,
      recentActivity,
    ] = await Promise.all([
      this.countByRole("student"),
      this.countByRole("vendor"),
      this.getTodayTransactionsCount(),
      this.getPendingApprovalsCount(),
      this.getTopVendorApprovals(2),
      this.getRecentActivity(10),
    ]);

    return {
      totalStudents,
      totalVendors,
      todayTransactions,
      pendingApprovals,
      topVendorApprovals,
      recentActivity,
    };
  }

  // ── Users Management ─────────────────────────────────

  async getUsers(page: number, limit: number) {
    const client = db.client;
    const offset = (page - 1) * limit;

    const [users, total] = await Promise.all([
      client.user.findMany({
        where: {
          roles: { some: { role: "student" } },
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: {
            select: { fullName: true, avatarUrl: true },
          },
          _count: {
            select: {
              transactions: true,
              bookings: true,
            },
          },
          transactions: {
            select: { amount: true, status: true },
            where: { status: "completed" },
          },
        },
      }),
      client.user.count({
        where: { roles: { some: { role: "student" } } },
      }),
    ]);

    const data = users.map((u) => ({
      id: u.id,
      name: u.profile?.fullName || u.email,
      avatarUrl: u.profile?.avatarUrl,
      email: u.email,
      joinedDate: u.createdAt,
      transactionsMade: u._count.transactions,
      vendorsVisited: u._count.bookings,
      revenueGenerated: u.transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      ),
      pointsGained: 0, // placeholder for future loyalty system
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ── Vendors Management ───────────────────────────────

  async getVendors(page: number, limit: number, status?: string) {
    const client = db.client;
    const offset = (page - 1) * limit;

    const whereClause: any = {
      roles: { some: { role: "vendor" } },
    };

    if (status) {
      whereClause.vendorStatus = status;
    }

    const [vendors, total] = await Promise.all([
      client.user.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          createdAt: true,
          vendorStatus: true,
          profile: {
            select: { fullName: true, avatarUrl: true },
          },
          _count: {
            select: { transactions: true },
          },
          transactions: {
            select: { amount: true },
            where: { status: "completed" },
          },
        },
      }),
      client.user.count({ where: whereClause }),
    ]);

    const now = new Date();
    const data = vendors.map((v) => ({
      id: v.id,
      name: v.profile?.fullName || v.email,
      avatarUrl: v.profile?.avatarUrl,
      email: v.email,
      vendorStatus: v.vendorStatus,
      registeredDate: v.createdAt,
      durationDays: Math.floor(
        (now.getTime() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      ),
      customersServed: v._count.transactions,
      totalTransactions: v._count.transactions,
      revenueGenerated: v.transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      ),
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveVendor(vendorId: string) {
    return db.update("User", vendorId, { vendorStatus: "approved" });
  }

  async rejectVendor(vendorId: string) {
    return db.update("User", vendorId, { vendorStatus: "rejected" });
  }

  // ── Transactions Management ──────────────────────────

  async getTransactions(page: number, limit: number) {
    const client = db.client;
    const offset = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      client.transaction.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          paymentMethod: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              profile: { select: { fullName: true } },
            },
          },
          booking: {
            select: { serviceType: true, serviceId: true },
          },
        },
      }),
      client.transaction.count(),
    ]);

    const data = transactions.map((t) => ({
      id: t.id,
      date: t.createdAt,
      time: new Date(t.createdAt).toLocaleTimeString("en-AU"),
      userName: t.user?.profile?.fullName || t.user?.email || "Unknown",
      vendorName: t.booking?.serviceType || "N/A",
      amount: Number(t.amount),
      currency: t.currency,
      status: t.status,
      paymentMethod: t.paymentMethod,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ── Analytics ────────────────────────────────────────

  async getRevenueAnalytics(mode: "monthly" | "yearly" = "monthly") {
    const client = db.client;

    if (mode === "yearly") {
      const results: any[] = await client.$queryRaw`
        SELECT
          EXTRACT(YEAR FROM created_at)::int AS year,
          SUM(amount)::float AS revenue
        FROM transactions
        WHERE status = 'completed'
        GROUP BY year
        ORDER BY year
      `;
      return { yearly: results };
    }

    // Monthly (current year)
    const currentYear = new Date().getFullYear();
    const results: any[] = await client.$queryRaw`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        EXTRACT(MONTH FROM created_at)::int AS month_num,
        SUM(amount)::float AS revenue
      FROM transactions
      WHERE status = 'completed'
        AND EXTRACT(YEAR FROM created_at) = ${currentYear}
      GROUP BY month, month_num
      ORDER BY month_num
    `;

    return {
      monthly: results.map((r) => ({ month: r.month, revenue: r.revenue })),
    };
  }

  async getUserRegistrationAnalytics() {
    const client = db.client;
    const currentYear = new Date().getFullYear();

    const results: any[] = await client.$queryRaw`
      SELECT
        TO_CHAR(u.created_at, 'Mon') AS month,
        EXTRACT(MONTH FROM u.created_at)::int AS month_num,
        COUNT(u.id)::int AS count
      FROM users u
      INNER JOIN user_roles ur ON ur.user_id = u.id
      WHERE ur.role = 'student'
        AND EXTRACT(YEAR FROM u.created_at) = ${currentYear}
      GROUP BY month, month_num
      ORDER BY month_num
    `;

    return results.map((r) => ({ month: r.month, count: r.count }));
  }

  async getVendorRegistrationAnalytics() {
    const client = db.client;
    const currentYear = new Date().getFullYear();

    const results: any[] = await client.$queryRaw`
      SELECT
        TO_CHAR(u.created_at, 'Mon') AS month,
        EXTRACT(MONTH FROM u.created_at)::int AS month_num,
        COUNT(u.id)::int AS count
      FROM users u
      INNER JOIN user_roles ur ON ur.user_id = u.id
      WHERE ur.role = 'vendor'
        AND EXTRACT(YEAR FROM u.created_at) = ${currentYear}
      GROUP BY month, month_num
      ORDER BY month_num
    `;

    return results.map((r) => ({ month: r.month, count: r.count }));
  }

  async getCategoryDistribution() {
    const client = db.client;

    const [
      accommodations,
      cars,
      jobs,
      consultations,
      accounting,
      loans,
      events,
      certifications,
      drivingLicense,
      airportPickups,
    ] = await Promise.all([
      client.accommodationEnquiry.count(),
      client.carRentRequest.count(),
      client.jobApplication.count(),
      client.consultation.count(),
      client.accountingBooking.count(),
      client.loanApplication.count(),
      client.eventRegistration.count(),
      client.certificationRequest.count(),
      client.drivingLicenseBooking.count(),
      client.airportPickup.count(),
    ]);

    return {
      categories: [
        { category: "Accommodation", count: accommodations },
        { category: "Car Rental", count: cars },
        { category: "Jobs", count: jobs },
        { category: "Consultations", count: consultations },
        { category: "Accounting", count: accounting },
        { category: "Loans", count: loans },
        { category: "Events", count: events },
        { category: "Certifications", count: certifications },
        { category: "Driving License", count: drivingLicense },
        { category: "Airport Pickup", count: airportPickups },
      ],
    };
  }

  // ── Private Helpers ──────────────────────────────────

  private async countByRole(role: "student" | "vendor" | "admin") {
    return db.client.userRole.count({ where: { role } });
  }

  private async getTodayTransactionsCount() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return db.client.transaction.count({
      where: { createdAt: { gte: startOfDay } },
    });
  }

  private async getPendingApprovalsCount() {
    return db.client.user.count({
      where: {
        roles: { some: { role: "vendor" } },
        vendorStatus: "pending",
      },
    });
  }

  private async getTopVendorApprovals(limit: number) {
    const vendors = await db.client.user.findMany({
      where: {
        roles: { some: { role: "vendor" } },
        vendorStatus: "pending",
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: { select: { fullName: true } },
      },
    });

    return vendors.map((v) => ({
      id: v.id,
      name: v.profile?.fullName || v.email,
      registrationDate: v.createdAt,
    }));
  }

  private async getRecentActivity(limit: number) {
    const notifications = await db.client.notification.findMany({
      where: { receiverRole: "admin" },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
      },
    });

    return notifications;
  }
}

export const adminService = new AdminService();
