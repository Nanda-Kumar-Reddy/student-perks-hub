import { prisma } from "../lib/prisma";

class ChatService {
  /**
   * Get all conversations for a user with last message
   */
  async getConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { include: { profile: { select: { fullName: true, avatarUrl: true } } } },
        user2: { include: { profile: { select: { fullName: true, avatarUrl: true } } } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Compute unread counts
    const results = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
        const lastMessage = conv.messages[0] ?? null;

        return {
          id: conv.id,
          otherUser: {
            id: otherUser.id,
            fullName: otherUser.profile?.fullName ?? otherUser.email,
            avatarUrl: otherUser.profile?.avatarUrl ?? null,
          },
          lastMessage: lastMessage
            ? {
                text: lastMessage.messageText,
                senderId: lastMessage.senderId,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
          updatedAt: conv.updatedAt,
        };
      })
    );

    return results;
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or unauthorized");
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          include: { profile: { select: { fullName: true, avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return messages.reverse().map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.sender.profile?.fullName ?? m.sender.email,
      messageText: m.messageText,
      isRead: m.isRead,
      createdAt: m.createdAt,
    }));
  }

  /**
   * Start or get a conversation with another user
   */
  async startConversation(userId: string, otherUserId: string) {
    const [a, b] = [userId, otherUserId].sort();

    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: a, user2Id: b },
          { user1Id: b, user2Id: a },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { user1Id: a, user2Id: b },
      });
    }

    return conversation;
  }
}

export const chatService = new ChatService();
