import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/services/socket";
import { useAuth } from "@/contexts/AuthContext";
import type { Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageText: string;
  createdAt: string;
  isRead: boolean;
}

export interface ConversationItem {
  id: string;
  otherUser: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface RealtimeNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  conversations: ConversationItem[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  unreadTotal: number;
  onlineUsers: string[];
  notifications: RealtimeNotification[];
  openChatWith: (userId: string, userName: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  socket: null,
  isConnected: false,
  chatOpen: false,
  setChatOpen: () => {},
  conversations: [],
  activeConversationId: null,
  setActiveConversationId: () => {},
  messages: [],
  sendMessage: () => {},
  unreadTotal: 0,
  onlineUsers: [],
  notifications: [],
  openChatWith: () => {},
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // Connect socket when user logs in
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    // For now, we use a placeholder token approach
    // In production, get the actual JWT token from auth service
    const token = localStorage.getItem("access_token") || "demo-token";
    const sock = connectSocket(token);
    socketRef.current = sock;

    // If no realtime server configured, stay in demo mode
    if (!sock) return;

    sock.on("connect", () => setIsConnected(true));
    sock.on("disconnect", () => setIsConnected(false));

    // Listen for incoming messages
    sock.on("receiveMessage", (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // Update conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: { text: msg.messageText, senderId: msg.senderId, createdAt: msg.createdAt },
                unreadCount: msg.senderId !== user.id ? c.unreadCount + 1 : c.unreadCount,
              }
            : c
        )
      );
    });

    // Conversation updates
    sock.on("conversationUpdated", (data: { conversationId: string; lastMessage: string; lastMessageAt: string; senderId: string }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? { ...c, lastMessage: { text: data.lastMessage, senderId: data.senderId, createdAt: data.lastMessageAt } }
            : c
        )
      );
    });

    // Messages read
    sock.on("messagesRead", ({ conversationId }: { conversationId: string }) => {
      setMessages((prev) => prev.map((m) => (m.conversationId === conversationId ? { ...m, isRead: true } : m)));
    });

    // Online status
    sock.on("onlineUsers", ({ userIds }: { userIds: string[] }) => setOnlineUsers(userIds));
    sock.on("userOnline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    });
    sock.on("userOffline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Notifications
    sock.on("newNotification", (notif: RealtimeNotification) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    // Request online users on connect
    sock.emit("getOnlineUsers");

    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, [user]);

  // Join/leave conversation rooms
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !activeConversationId) return;

    sock.emit("joinConversation", { conversationId: activeConversationId });
    setMessages([]);

    return () => {
      sock.emit("leaveConversation", { conversationId: activeConversationId });
    };
  }, [activeConversationId]);

  const sendMessage = useCallback(
    (text: string) => {
      const sock = socketRef.current;
      if (!sock || !activeConversationId || !text.trim()) return;

      sock.emit("sendMessage", {
        conversationId: activeConversationId,
        messageText: text.trim(),
      });
    },
    [activeConversationId]
  );

  const openChatWith = useCallback(
    (userId: string, userName: string) => {
      // Check if conversation already exists
      const existing = conversations.find((c) => c.otherUser.id === userId);
      if (existing) {
        setActiveConversationId(existing.id);
      } else {
        // Create a temporary conversation entry
        const tempId = `temp-${userId}`;
        setConversations((prev) => [
          {
            id: tempId,
            otherUser: { id: userId, fullName: userName, avatarUrl: null },
            lastMessage: null,
            unreadCount: 0,
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setActiveConversationId(tempId);

        // Emit to create conversation on server
        const sock = socketRef.current;
        if (sock) {
          sock.emit("sendMessage", { recipientId: userId, messageText: "" });
        }
      }
      setChatOpen(true);
    },
    [conversations]
  );

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <ChatContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        chatOpen,
        setChatOpen,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        unreadTotal,
        onlineUsers,
        notifications,
        openChatWith,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
