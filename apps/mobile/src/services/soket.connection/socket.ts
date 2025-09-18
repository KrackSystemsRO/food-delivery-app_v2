import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";

let socket: Socket | null = null;

const { API_URL } = Constants.expoConfig?.extra ?? {};

export function connectSocket(token: string): Socket {
  if (!socket) {
    socket = io(`${API_URL}`, {
      auth: { token },
      transports: ["websocket"], // force websocket
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000, // connection timeout
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected (connection socket):", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });
  }
  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    throw new Error("Socket not connected. Call connectSocket() after login.");
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
