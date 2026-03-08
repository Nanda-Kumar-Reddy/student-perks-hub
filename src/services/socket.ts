/**
 * Socket.io Client Service
 * Manages the WebSocket connection to the realtime server.
 * Only connects when VITE_REALTIME_SERVER_URL is explicitly configured.
 */
import { io, Socket } from "socket.io-client";

const REALTIME_SERVER_URL = import.meta.env.VITE_REALTIME_SERVER_URL || "";

let socket: Socket | null = null;

export function connectSocket(token: string): Socket | null {
  // Don't attempt connection if no realtime server URL is configured
  if (!REALTIME_SERVER_URL) {
    console.info("ℹ️ Realtime server not configured — chat runs in demo mode");
    return null;
  }

  if (socket?.connected) return socket;

  socket = io(REALTIME_SERVER_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  });

  socket.on("connect", () => {
    console.log("✅ Connected to realtime server");
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from realtime server:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("Socket connection error:", err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}
