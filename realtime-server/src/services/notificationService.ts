import { prisma } from "./prisma";

export const realtimeNotificationService = {
  /**
   * Create and return a notification (for push via socket)
   */
  async createNotification(data: {
    receiverId: string;
    receiverRole: "student" | "vendor" | "admin";
    title: string;
    message: string;
    type?: string;
  }) {
    return prisma.notification.create({
      data: {
        receiverId: data.receiverId,
        receiverRole: data.receiverRole,
        title: data.title,
        message: data.message,
        type: (data.type as any) ?? "info",
      },
    });
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    await prisma.notification.updateMany({
      where: { id: notificationId, receiverId: userId },
      data: { isRead: true },
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { receiverId: userId, isRead: false },
      data: { isRead: true },
    });
  },
};
