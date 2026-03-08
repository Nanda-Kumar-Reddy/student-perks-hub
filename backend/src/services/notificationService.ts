/**
 * Notification Service
 */
import { notifications } from "../wrappers/notificationWrapper";

class NotificationService {
  async getMyNotifications(userId: string, page: number = 1, limit: number = 20) {
    return notifications.getForUser(userId, page, limit);
  }

  async getUnreadCount(userId: string) {
    return notifications.getUnreadCount(userId);
  }

  async markAsRead(notificationId: string, userId: string) {
    await notifications.markAsRead(notificationId, userId);
    return { message: "Notification marked as read" };
  }

  async markAllAsRead(userId: string) {
    await notifications.markAllAsRead(userId);
    return { message: "All notifications marked as read" };
  }
}

export const notificationService = new NotificationService();
