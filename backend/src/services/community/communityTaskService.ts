/**
 * Community Task Service — business logic for community tasks
 */
import { db } from "../../wrappers/databaseWrapper";
import { notifications } from "../../wrappers/notificationWrapper";

const PROHIBITED_KEYWORDS = ["scam", "illegal", "drugs", "weapon", "gambling"];
const MIN_PAYMENT = 5;

export interface CreateTaskInput {
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  payment: number;
  requiresExperience?: boolean;
  requiresTransport?: boolean;
  requiresPoliceCheck?: boolean;
  requiresChildrenCheck?: boolean;
  requiresFirstAid?: boolean;
  showPhonePublicly?: boolean;
  chatThroughApp?: boolean;
}

class CommunityTaskService {
  // ── Create Task ─────────────────────────────────────
  async createTask(userId: string, input: CreateTaskInput) {
    // Automated checks
    this.validateContent(input.title + " " + input.description);
    if (input.payment < MIN_PAYMENT) {
      throw Object.assign(new Error(`Minimum payment is $${MIN_PAYMENT}`), { status: 400 });
    }

    const task = await db.create("CommunityTask", {
      userId,
      title: input.title,
      category: input.category,
      description: input.description,
      location: input.location,
      date: new Date(input.date),
      time: input.time,
      duration: input.duration,
      payment: input.payment,
      requiresExperience: input.requiresExperience ?? false,
      requiresTransport: input.requiresTransport ?? false,
      requiresPoliceCheck: input.requiresPoliceCheck ?? false,
      requiresChildrenCheck: input.requiresChildrenCheck ?? false,
      requiresFirstAid: input.requiresFirstAid ?? false,
      showPhonePublicly: input.showPhonePublicly ?? false,
      chatThroughApp: input.chatThroughApp ?? true,
      status: "PENDING_APPROVAL",
    });

    // Notify admins
    await notifications.notifyAdmins(
      "New Community Task Submitted",
      `Task "${input.title}" submitted by a user and requires approval.`,
      "application"
    );

    return task;
  }

  // ── List approved tasks (public) ─────────────────────
  async listApprovedTasks(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const where: any = { status: "APPROVED" };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }
    if (params.category) where.category = params.category;
    if (params.location) where.location = { contains: params.location, mode: "insensitive" };

    return db.findMany("CommunityTask", where, {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }, {
      user: { include: { profile: true } },
      _count: { select: { applications: true } },
    });
  }

  // ── Get task detail ──────────────────────────────────
  async getTaskById(taskId: string) {
    const task = await db.client.communityTask.findUnique({
      where: { id: taskId },
      include: {
        user: { include: { profile: true } },
        applications: { include: { user: { include: { profile: true } } } },
        _count: { select: { applications: true } },
      },
    });
    if (!task) throw Object.assign(new Error("Task not found"), { status: 404 });
    return task;
  }

  // ── My posted tasks ──────────────────────────────────
  async getMyTasks(userId: string, page = 1, limit = 20) {
    return db.findMany("CommunityTask", { userId }, { page, limit }, {
      _count: { select: { applications: true } },
    });
  }

  // ── Apply for task ───────────────────────────────────
  async applyForTask(taskId: string, userId: string, message?: string) {
    const task = await db.findById("CommunityTask", taskId);
    if (!task) throw Object.assign(new Error("Task not found"), { status: 404 });
    if (task.status !== "APPROVED") throw Object.assign(new Error("Task is not available"), { status: 400 });
    if (task.userId === userId) throw Object.assign(new Error("Cannot apply to your own task"), { status: 400 });

    const existing = await db.client.taskApplication.findUnique({
      where: { taskId_userId: { taskId, userId } },
    });
    if (existing) throw Object.assign(new Error("Already applied"), { status: 409 });

    const application = await db.create("TaskApplication", { taskId, userId, message });

    // Notify task owner
    await notifications.send({
      receiverId: task.userId,
      receiverRole: "student",
      title: "New Task Application",
      message: `Someone applied to your task "${task.title}".`,
      type: "application",
    });

    return application;
  }

  // ── Chat messages ────────────────────────────────────
  async sendMessage(taskId: string, senderId: string, content: string) {
    const task = await db.findById("CommunityTask", taskId);
    if (!task) throw Object.assign(new Error("Task not found"), { status: 404 });
    return db.create("TaskMessage", { taskId, senderId, content });
  }

  async getMessages(taskId: string, page = 1, limit = 50) {
    return db.findMany("TaskMessage", { taskId }, { page, limit, sortBy: "createdAt", sortOrder: "asc" }, {
      sender: { include: { profile: true } },
    });
  }

  // ── Mark as filled / cancel ──────────────────────────
  async updateTaskStatus(taskId: string, userId: string, status: "FILLED" | "CANCELLED") {
    const task = await db.findById("CommunityTask", taskId);
    if (!task) throw Object.assign(new Error("Task not found"), { status: 404 });
    if (task.userId !== userId) throw Object.assign(new Error("Not authorized"), { status: 403 });
    return db.update("CommunityTask", taskId, { status });
  }

  // ── Admin: pending tasks ─────────────────────────────
  async getPendingTasks(page = 1, limit = 20) {
    return db.findMany("CommunityTask", { status: "PENDING_APPROVAL" }, { page, limit }, {
      user: { include: { profile: true, roles: true } },
    });
  }

  // ── Admin: approve ───────────────────────────────────
  async approveTask(taskId: string, adminNotes?: string) {
    const task = await db.update("CommunityTask", taskId, {
      status: "APPROVED",
      adminNotes,
    });

    await notifications.send({
      receiverId: task.userId,
      receiverRole: "student",
      title: "Task Approved",
      message: `Your task "${task.title}" has been approved and is now visible to the community.`,
      type: "success",
    });

    return task;
  }

  // ── Admin: reject ────────────────────────────────────
  async rejectTask(taskId: string, reason?: string) {
    const task = await db.update("CommunityTask", taskId, {
      status: "REJECTED",
      rejectionReason: reason,
    });

    await notifications.send({
      receiverId: task.userId,
      receiverRole: "student",
      title: "Task Rejected",
      message: `Your task "${task.title}" was rejected.${reason ? ` Reason: ${reason}` : ""}`,
      type: "error",
    });

    return task;
  }

  // ── Admin: flag ──────────────────────────────────────
  async flagTask(taskId: string, adminNotes?: string) {
    return db.update("CommunityTask", taskId, {
      status: "FLAGGED",
      adminNotes,
    });
  }

  // ── Admin: edit task ───────────────────────────────
  async editTask(taskId: string, input: Partial<CreateTaskInput> & { adminNotes?: string }) {
    const task = await db.findById("CommunityTask", taskId);
    if (!task) throw Object.assign(new Error("Task not found"), { status: 404 });

    const updateData: any = {};
    if (input.title) { this.validateContent(input.title); updateData.title = input.title; }
    if (input.description) { this.validateContent(input.description); updateData.description = input.description; }
    if (input.category) updateData.category = input.category;
    if (input.location) updateData.location = input.location;
    if (input.date) updateData.date = new Date(input.date);
    if (input.time) updateData.time = input.time;
    if (input.duration) updateData.duration = input.duration;
    if (input.payment !== undefined) updateData.payment = input.payment;
    if (input.adminNotes) updateData.adminNotes = input.adminNotes;

    return db.update("CommunityTask", taskId, updateData);
  }

  // ── Automated content validation ─────────────────────
  private validateContent(text: string) {
    const lower = text.toLowerCase();
    for (const kw of PROHIBITED_KEYWORDS) {
      if (lower.includes(kw)) {
        throw Object.assign(new Error(`Content contains prohibited keyword: "${kw}"`), { status: 400 });
      }
    }
  }
}

export const communityTaskService = new CommunityTaskService();
