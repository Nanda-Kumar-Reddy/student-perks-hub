import { Server, Socket } from "socket.io";
import { chatService } from "../services/chatService";
import { onlineTracker } from "../services/onlineTracker";
import type { AuthPayload } from "../middlewares/authSocket";

export function registerChatHandlers(io: Server, socket: Socket) {
  const user = (socket as any).user as AuthPayload;

  /**
   * Join a conversation room
   */
  socket.on("joinConversation", async ({ conversationId }: { conversationId: string }) => {
    socket.join(`conversation:${conversationId}`);

    // Mark messages as read when joining
    await chatService.markMessagesRead(conversationId, user.userId);

    // Notify the other user that messages were read
    socket.to(`conversation:${conversationId}`).emit("messagesRead", {
      conversationId,
      readBy: user.userId,
    });
  });

  /**
   * Leave a conversation room
   */
  socket.on("leaveConversation", ({ conversationId }: { conversationId: string }) => {
    socket.leave(`conversation:${conversationId}`);
  });

  /**
   * Send a message
   */
  socket.on("sendMessage", async (data: {
    conversationId?: string;
    recipientId?: string;
    messageText: string;
  }) => {
    try {
      let conversationId = data.conversationId;

      // If no conversationId, create/find conversation with recipientId
      if (!conversationId && data.recipientId) {
        const convo = await chatService.getOrCreateConversation(user.userId, data.recipientId);
        conversationId = convo.id;
        socket.join(`conversation:${conversationId}`);
      }

      if (!conversationId) {
        socket.emit("error", { message: "Conversation ID or recipient ID required" });
        return;
      }

      const message = await chatService.saveMessage(conversationId, user.userId, data.messageText);

      // Broadcast to conversation room
      io.to(`conversation:${conversationId}`).emit("receiveMessage", {
        id: message.id,
        conversationId,
        senderId: message.senderId,
        senderName: message.sender.profile?.fullName ?? "Unknown",
        messageText: message.messageText,
        createdAt: message.createdAt.toISOString(),
        isRead: false,
      });

      // Also emit conversationUpdated for sidebar refresh
      io.to(`conversation:${conversationId}`).emit("conversationUpdated", {
        conversationId,
        lastMessage: message.messageText,
        lastMessageAt: message.createdAt.toISOString(),
        senderId: message.senderId,
      });
    } catch (err) {
      console.error("sendMessage error:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  /**
   * Mark messages as read
   */
  socket.on("messageRead", async ({ conversationId }: { conversationId: string }) => {
    await chatService.markMessagesRead(conversationId, user.userId);
    socket.to(`conversation:${conversationId}`).emit("messagesRead", {
      conversationId,
      readBy: user.userId,
    });
  });

  /**
   * Typing indicator
   */
  socket.on("typing", ({ conversationId }: { conversationId: string }) => {
    socket.to(`conversation:${conversationId}`).emit("userTyping", {
      conversationId,
      userId: user.userId,
    });
  });

  socket.on("stopTyping", ({ conversationId }: { conversationId: string }) => {
    socket.to(`conversation:${conversationId}`).emit("userStopTyping", {
      conversationId,
      userId: user.userId,
    });
  });
}
