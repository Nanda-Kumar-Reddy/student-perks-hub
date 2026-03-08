import { Server, Socket } from "socket.io";
import { realtimeNotificationService } from "../services/notificationService";
import type { AuthPayload } from "../middlewares/authSocket";

export function registerNotificationHandlers(io: Server, socket: Socket) {
  const user = (socket as any).user as AuthPayload;

  /**
   * Mark a single notification as read
   */
  socket.on("markNotificationRead", async ({ notificationId }: { notificationId: string }) => {
    await realtimeNotificationService.markAsRead(notificationId, user.userId);
    socket.emit("notificationMarkedRead", { notificationId });
  });

  /**
   * Mark all notifications as read
   */
  socket.on("markAllNotificationsRead", async () => {
    await realtimeNotificationService.markAllAsRead(user.userId);
    socket.emit("allNotificationsMarkedRead");
  });
}

/**
 * Utility: Push a notification to a specific user via their socket room
 */
export function pushNotificationToUser(
  io: Server,
  userId: string,
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
  }
) {
  io.to(`user:${userId}`).emit("newNotification", notification);
}
