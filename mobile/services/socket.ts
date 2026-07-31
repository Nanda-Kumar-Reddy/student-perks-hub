import { io, type Socket } from "socket.io-client";
import { REALTIME_SERVER_URL } from "@/constants/env";

let socket: Socket | null = null;

export function connectSocket(token: string): Socket | null {
  if (!REALTIME_SERVER_URL) return null;
  if (socket?.connected) return socket;

  socket = io(REALTIME_SERVER_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
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
