import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "./config/env";
import { authSocketMiddleware, type AuthPayload } from "./middlewares/authSocket";
import { registerChatHandlers } from "./socketHandlers/chatHandler";
import { registerNotificationHandlers, pushNotificationToUser } from "./socketHandlers/notificationHandler";
import { onlineTracker } from "./services/onlineTracker";
import { realtimeNotificationService } from "./services/notificationService";

const app = express();
const server = http.createServer(app);

// CORS config
const allowedOrigins = [
  config.cors.origin,
  config.cors.productionUrls,
  "http://localhost:5173",
  "http://localhost:8080",
].filter(Boolean) as string[];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Auth middleware for all socket connections
io.use(authSocketMiddleware);

// Connection handler
io.on("connection", (socket) => {
  const user = (socket as any).user as AuthPayload;
  console.log(`✅ User connected: ${user.userId} (socket: ${socket.id})`);

  // Track online status
  onlineTracker.addUser(user.userId, socket.id);

  // Join user-specific room for notifications
  socket.join(`user:${user.userId}`);

  // Broadcast online status
  io.emit("userOnline", { userId: user.userId });

  // Register handlers
  registerChatHandlers(io, socket);
  registerNotificationHandlers(io, socket);

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${user.userId} (socket: ${socket.id})`);
    onlineTracker.removeSocket(user.userId, socket.id);

    if (!onlineTracker.isOnline(user.userId)) {
      io.emit("userOffline", { userId: user.userId });
    }
  });

  // Get online users
  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", { userIds: onlineTracker.getOnlineUserIds() });
  });
});

// ── REST API endpoints (for main backend to trigger events) ──

/**
 * POST /api/push-notification
 * Main backend calls this to push real-time notifications
 */
app.post("/api/push-notification", async (req, res) => {
  try {
    const { receiverId, receiverRole, title, message, type } = req.body;

    const notification = await realtimeNotificationService.createNotification({
      receiverId,
      receiverRole,
      title,
      message,
      type,
    });

    pushNotificationToUser(io, receiverId, {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      createdAt: notification.createdAt.toISOString(),
    });

    res.json({ success: true, notificationId: notification.id });
  } catch (err) {
    console.error("Push notification error:", err);
    res.status(500).json({ error: "Failed to push notification" });
  }
});

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "realtime-server",
    onlineUsers: onlineTracker.getOnlineUserIds().length,
    timestamp: new Date().toISOString(),
  });
});

// Start server
server.listen(config.port, () => {
  console.log(`🚀 Realtime server running on port ${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
});

export { io, server };
