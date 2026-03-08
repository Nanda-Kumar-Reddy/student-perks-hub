import { prisma } from "./prisma";

export const chatService = {
  /**
   * Find or create a conversation between two users
   */
  async getOrCreateConversation(user1Id: string, user2Id: string) {
    // Ensure consistent ordering
    const [a, b] = [user1Id, user2Id].sort();

    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: a, user2Id: b },
          { user1Id: b, user2Id: a },
        ],
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { user1Id: a, user2Id: b },
        include: {
          user1: { include: { profile: true } },
          user2: { include: { profile: true } },
        },
      });
    }

    return conversation;
  },

  /**
   * Save a message to the database
   */
  async saveMessage(conversationId: string, senderId: string, messageText: string) {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        messageText,
      },
      include: {
        sender: { include: { profile: true } },
      },
    });

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  },

  /**
   * Mark messages as read
   */
  async markMessagesRead(conversationId: string, userId: string) {
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  },

  /**
   * Get unread count for a user across all conversations
   */
  async getUnreadCount(userId: string): Promise<number> {
    // Get all conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: { id: true },
    });

    const conversationIds = conversations.map((c) => c.id);
    if (conversationIds.length === 0) return 0;

    return prisma.message.count({
      where: {
        conversationId: { in: conversationIds },
        senderId: { not: userId },
        isRead: false,
      },
    });
  },
};
