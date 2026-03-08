/**
 * Vendor Service — all business logic & database queries for vendor portal
 */
import { db } from "../../wrappers/databaseWrapper";

class VendorService {
  // ── Dashboard ──────────────────────────────────────

  async getDashboardStats(vendorProfileId: string) {
    const client = db.client;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [todayCustomers, couponsUsedToday, todayRevenue, monthRevenue, topTransactions] =
      await Promise.all([
        this.getTodayCustomers(vendorProfileId, startOfDay),
        this.getCouponsUsedToday(vendorProfileId, startOfDay),
        this.getRevenue(vendorProfileId, startOfDay),
        this.getRevenue(vendorProfileId, startOfMonth),
        this.getTopTransactions(vendorProfileId, startOfDay, 3),
      ]);

    return {
      todayCustomers,
      couponsUsedToday,
      todayRevenue,
      monthRevenue,
      topTransactions,
    };
  }

  private async getTodayCustomers(vendorProfileId: string, since: Date): Promise<number> {
    const client = db.client;
    // Get the user id from vendor profile to match transactions.vendorId
    const profile = await client.vendorProfile.findUnique({
      where: { id: vendorProfileId },
      select: { userId: true },
    });
    if (!profile) return 0;

    const result: any[] = await client.$queryRaw`
      SELECT COUNT(DISTINCT user_id)::int AS count
      FROM transactions
      WHERE vendor_id = ${profile.userId}::uuid
        AND created_at >= ${since}
        AND status = 'completed'
    `;
    return result[0]?.count ?? 0;
  }

  private async getCouponsUsedToday(vendorProfileId: string, since: Date): Promise<number> {
    return db.client.couponUsage.count({
      where: {
        usedAt: { gte: since },
        coupon: { vendorId: vendorProfileId },
      },
    });
  }

  private async getRevenue(vendorProfileId: string, since: Date): Promise<number> {
    const client = db.client;
    const profile = await client.vendorProfile.findUnique({
      where: { id: vendorProfileId },
      select: { userId: true },
    });
    if (!profile) return 0;

    const result: any[] = await client.$queryRaw`
      SELECT COALESCE(SUM(amount), 0)::float AS total
      FROM transactions
      WHERE vendor_id = ${profile.userId}::uuid
        AND created_at >= ${since}
        AND status = 'completed'
    `;
    return result[0]?.total ?? 0;
  }

  private async getTopTransactions(vendorProfileId: string, since: Date, limit: number) {
    const client = db.client;
    const profile = await client.vendorProfile.findUnique({
      where: { id: vendorProfileId },
      select: { userId: true },
    });
    if (!profile) return [];

    const transactions = await client.transaction.findMany({
      where: {
        vendorId: profile.userId,
        createdAt: { gte: since },
        status: "completed",
      },
      take: limit,
      orderBy: { amount: "desc" },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            profile: { select: { fullName: true } },
          },
        },
      },
    });

    return transactions.map((t) => ({
      id: t.id,
      customerName: t.user?.profile?.fullName || t.user?.email || "Unknown",
      date: t.createdAt,
      time: new Date(t.createdAt).toLocaleTimeString("en-AU"),
      amount: Number(t.amount),
    }));
  }

  // ── Transactions ───────────────────────────────────

  async getTransactions(vendorUserId: string, page: number, limit: number) {
    const client = db.client;
    const offset = (page - 1) * limit;

    const where = { vendorId: vendorUserId, status: "completed" as const };

    const [transactions, total] = await Promise.all([
      client.transaction.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              profile: { select: { fullName: true } },
            },
          },
        },
      }),
      client.transaction.count({ where }),
    ]);

    const data = transactions.map((t) => ({
      id: t.id,
      customerName: t.user?.profile?.fullName || t.user?.email || "Unknown",
      date: t.createdAt,
      time: new Date(t.createdAt).toLocaleTimeString("en-AU"),
      amount: Number(t.amount),
      currency: t.currency,
      status: t.status,
    }));

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Coupons ────────────────────────────────────────

  async createCoupon(vendorProfileId: string, data: {
    templateType: string;
    couponTitle: string;
    discountValue: string;
    description?: string;
  }) {
    return db.client.coupon.create({
      data: {
        vendorId: vendorProfileId,
        templateType: data.templateType,
        couponTitle: data.couponTitle,
        discountValue: data.discountValue,
        description: data.description,
      },
    });
  }

  async getCoupons(vendorProfileId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      db.client.coupon.findMany({
        where: { vendorId: vendorProfileId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { usages: true } },
        },
      }),
      db.client.coupon.count({ where: { vendorId: vendorProfileId } }),
    ]);

    const data = coupons.map((c) => ({
      id: c.id,
      templateType: c.templateType,
      couponTitle: c.couponTitle,
      discountValue: c.discountValue,
      description: c.description,
      isActive: c.isActive,
      usageCount: c._count.usages,
      createdAt: c.createdAt,
    }));

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async deleteCoupon(vendorProfileId: string, couponId: string) {
    const coupon = await db.client.coupon.findFirst({
      where: { id: couponId, vendorId: vendorProfileId },
    });
    if (!coupon) {
      throw Object.assign(new Error("Coupon not found or access denied"), { statusCode: 404 });
    }
    return db.client.coupon.delete({ where: { id: couponId } });
  }

  // ── Analytics ──────────────────────────────────────

  async getRevenueAnalytics(vendorUserId: string, mode: "monthly" | "yearly") {
    const client = db.client;

    if (mode === "yearly") {
      const results: any[] = await client.$queryRaw`
        SELECT
          EXTRACT(YEAR FROM created_at)::int AS year,
          SUM(amount)::float AS revenue
        FROM transactions
        WHERE vendor_id = ${vendorUserId}::uuid
          AND status = 'completed'
        GROUP BY year
        ORDER BY year
      `;
      return { yearly: results };
    }

    const currentYear = new Date().getFullYear();
    const results: any[] = await client.$queryRaw`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        EXTRACT(MONTH FROM created_at)::int AS month_num,
        SUM(amount)::float AS revenue
      FROM transactions
      WHERE vendor_id = ${vendorUserId}::uuid
        AND status = 'completed'
        AND EXTRACT(YEAR FROM created_at) = ${currentYear}
      GROUP BY month, month_num
      ORDER BY month_num
    `;

    return {
      monthly: results.map((r) => ({ month: r.month, revenue: r.revenue })),
    };
  }

  async getCustomerVisitAnalytics(vendorUserId: string) {
    const client = db.client;
    const currentYear = new Date().getFullYear();

    const results: any[] = await client.$queryRaw`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        EXTRACT(MONTH FROM created_at)::int AS month_num,
        COUNT(DISTINCT user_id)::int AS customers
      FROM transactions
      WHERE vendor_id = ${vendorUserId}::uuid
        AND status = 'completed'
        AND EXTRACT(YEAR FROM created_at) = ${currentYear}
      GROUP BY month, month_num
      ORDER BY month_num
    `;

    return results.map((r) => ({ month: r.month, customers: r.customers }));
  }

  async getRatingTrend(vendorProfileId: string) {
    const client = db.client;
    const currentYear = new Date().getFullYear();

    const results: any[] = await client.$queryRaw`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        EXTRACT(MONTH FROM created_at)::int AS month_num,
        ROUND(AVG(score)::numeric, 2)::float AS avg_rating,
        COUNT(id)::int AS count
      FROM ratings
      WHERE vendor_id = ${vendorProfileId}::uuid
        AND EXTRACT(YEAR FROM created_at) = ${currentYear}
      GROUP BY month, month_num
      ORDER BY month_num
    `;

    return results.map((r) => ({
      month: r.month,
      avgRating: r.avg_rating,
      count: r.count,
    }));
  }

  async getCouponUsageAnalytics(vendorProfileId: string) {
    const client = db.client;

    const results = await client.coupon.findMany({
      where: { vendorId: vendorProfileId },
      select: {
        couponTitle: true,
        _count: { select: { usages: true } },
      },
    });

    return results.map((c) => ({
      coupon: c.couponTitle,
      usage: c._count.usages,
    }));
  }

  // ── Settings ───────────────────────────────────────

  async getSettings(vendorUserId: string) {
    const client = db.client;
    const user = await client.user.findUnique({
      where: { id: vendorUserId },
      select: {
        email: true,
        vendorProfile: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            address: true,
            category: true,
          },
        },
      },
    });
    if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
    return {
      email: user.email,
      businessName: user.vendorProfile?.businessName,
      phone: user.vendorProfile?.phone,
      address: user.vendorProfile?.address,
      category: user.vendorProfile?.category,
    };
  }

  async updateSettings(vendorUserId: string, data: {
    businessName?: string;
    phone?: string;
    address?: string;
    category?: string;
  }) {
    return db.client.vendorProfile.upsert({
      where: { userId: vendorUserId },
      update: data,
      create: { userId: vendorUserId, ...data },
    });
  }

  // ── Helpers ────────────────────────────────────────

  async getVendorProfileId(userId: string): Promise<string> {
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
    return profile.id;
  }
}

export const vendorService = new VendorService();
