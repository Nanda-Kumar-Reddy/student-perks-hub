/**
 * Notification Wrapper
 * Abstracts notification creation and delivery.
 * Currently stores in DB. Extend with email, push, SMS, etc.
 */
import { db } from "./databaseWrapper";
import { AppRole, NotificationType } from "@prisma/client";

export interface NotificationPayload {
  receiverId: string;
  receiverRole: AppRole;
  title: string;
  message: string;
  type?: NotificationType;
}

class NotificationWrapper {
  /**
   * Send a notification to a specific user
   */
  async send(payload: NotificationPayload): Promise<void> {
    await db.create("Notification", {
      receiverId: payload.receiverId,
      receiverRole: payload.receiverRole,
      title: payload.title,
      message: payload.message,
      type: payload.type ?? "info",
    });

    // TODO: extend with email, push notifications, websocket, etc.
  }

  /**
   * Send notification to all users with a given role
   */
  async sendToRole(role: AppRole, title: string, message: string, type: NotificationType = "info"): Promise<void> {
    const result = await db.client.userRole.findMany({
      where: { role },
      select: { userId: true },
    });

    const notifications = result.map((ur) => ({
      receiverId: ur.userId,
      receiverRole: role,
      title,
      message,
      type,
    }));

    if (notifications.length > 0) {
      await db.client.notification.createMany({ data: notifications });
    }
  }

  /**
   * Send notification to all admins
   */
  async notifyAdmins(title: string, message: string, type: NotificationType = "info"): Promise<void> {
    await this.sendToRole("admin", title, message, type);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await db.client.notification.updateMany({
      where: { id: notificationId, receiverId: userId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await db.client.notification.updateMany({
      where: { receiverId: userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Get notifications for a user
   */
  async getForUser(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("Notification", { receiverId: userId }, { page, limit });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return db.client.notification.count({
      where: { receiverId: userId, isRead: false },
    });
  }
}

export const notifications = new NotificationWrapper();
