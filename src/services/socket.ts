/**
 * Socket.io Client Service
 * Manages the WebSocket connection to the realtime server.
 */
import { io, Socket } from "socket.io-client";

const REALTIME_SERVER_URL = import.meta.env.VITE_REALTIME_SERVER_URL || "http://localhost:4001";

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(REALTIME_SERVER_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => {
    console.log("✅ Connected to realtime server");
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from realtime server:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
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
