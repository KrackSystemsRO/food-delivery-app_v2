import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";
import { AppState } from "react-native";

let socket: Socket | null = null;

const { API_URL } = Constants.expoConfig?.extra ?? {};

export function connectSocket(token: string): Socket {
  if (!socket) {
    socket = io(API_URL!, {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      // Attempt manual reconnect if needed
      if (reason === "io server disconnect") {
        // the server disconnected us, need to reconnect manually
        socket?.connect();
      }
    });

    // Optional: handle app state changes (background / foreground)
    AppState.addEventListener("change", (state) => {
      if (state === "active" && socket?.disconnected) {
        console.log("App active, reconnecting socket...");
        socket.connect();
      }
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
