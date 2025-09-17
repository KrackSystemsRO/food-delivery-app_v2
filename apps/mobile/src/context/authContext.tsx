import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Socket } from "socket.io-client";
import {
  connectSocket,
  disconnectSocket,
} from "@/services/soket.connection/socket";
import { getUserDetails } from "@/services/user.service";
import { showToast } from "@/utils/toast";
import { Types } from "@my-monorepo/shared";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: Types.User.UserType | null;
  socket: Socket | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<Types.User.UserType | null>>;
  updateSelectedStores: (stores: SelectedStore[]) => void;
}

interface SelectedStore {
  storeId: string;
  cityId?: string;
  zoneId?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<Types.User.UserType | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep track of manager-selected stores to rejoin on reconnect

  const selectedStoresRef = useRef<SelectedStore[]>([]);

  /** ---------------- Attach listeners to a socket ---------------- */
  const attachSocketListeners = useCallback(
    (sock: Socket, currentUser: Types.User.UserType) => {
      sock.on("connect", () => {
        console.log("✅ Socket connected:", sock.id);

        switch (currentUser.role) {
          case "CLIENT":
            sock.emit("joinClientRoom", { clientId: currentUser._id });
            break;
          case "MANAGER":
            selectedStoresRef.current.forEach((storeId) =>
              sock.emit("joinManagerRoom", { storeId })
            );
            break;
          case "COURIER":
            if (currentUser.cityId && currentUser.zoneId) {
              sock.emit("joinCourierRoom", {
                cityId: currentUser.cityId,
                zoneId: currentUser.zoneId,
              });
            }
            break;
        }
      });

      sock.on("disconnect", (reason) =>
        console.warn("Socket disconnected:", reason)
      );
      sock.on("connect_error", (err) =>
        console.error("Socket connect error:", err)
      );

      // Role-specific events
      if (currentUser.role === "CLIENT") {
        sock.on("orderStatusUpdate", (data) =>
          console.log("Client order update:", data)
        );
        sock.on("orderCreated", (order) =>
          console.log("Client new order:", order)
        );
      }

      if (currentUser.role === "MANAGER") {
        sock.on("newOrder", (order) =>
          console.log("Manager new order:", order)
        );
        sock.on("orderUpdated", (order) =>
          console.log("Manager order update:", order)
        );
      }

      if (currentUser.role === "COURIER") {
        sock.on("orderCreated", (payload) =>
          console.log("Courier order created:", payload)
        );
        sock.on("orderUpdated", (payload) =>
          console.log("Courier order updated:", payload)
        );
      }
    },
    []
  );

  /** ----------------  Initial load (app start) ---------------- */
  useEffect(() => {
    (async () => {
      const storedAccess = await SecureStore.getItemAsync("accessToken");
      const storedRefresh = await SecureStore.getItemAsync("refreshToken");
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);

      if (storedAccess) {
        try {
          const { result: userDetails } = await getUserDetails();
          setUser(userDetails);

          // connect only if no active socket
          if (!socket || !socket.connected) {
            const newSock = connectSocket(storedAccess);
            setSocket(newSock);
            attachSocketListeners(newSock, userDetails);
          }
        } catch (err) {
          console.error("Failed to load user details", err);
        }
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachSocketListeners]);

  /** ----------------  Cleanup on unmount ---------------- */
  useEffect(() => {
    return () => {
      if (socket) {
        socket.removeAllListeners();
        disconnectSocket();
      }
    };
  }, [socket]);

  /** ----------------  Login ---------------- */
  const login = async (newAccess: string, newRefresh: string) => {
    await SecureStore.setItemAsync("accessToken", newAccess);
    await SecureStore.setItemAsync("refreshToken", newRefresh);
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);

    try {
      const { result: userDetails } = await getUserDetails();
      setUser(userDetails);

      if (!socket || !socket.connected) {
        const newSock = connectSocket(newAccess);
        setSocket(newSock);
        attachSocketListeners(newSock, userDetails);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  /** ----------------  Logout ---------------- */
  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    if (socket) {
      socket.removeAllListeners();
      disconnectSocket();
      setSocket(null);
    }
    showToast("success", "Logged out", "You have been logged out.");
  };

  /** ----------------  Refresh Tokens ---------------- */
  const refreshAuth = useCallback(async () => {
    const currentRefresh = await SecureStore.getItemAsync("refreshToken");
    if (!currentRefresh) return;

    try {
      const response = await fetch("/refresh-token", {
        method: "POST",
        body: JSON.stringify({ token: currentRefresh }),
        headers: { "Content-Type": "application/json" },
      });
      const { accessToken: newAccess, refreshToken: newRefresh } =
        await response.json();

      await SecureStore.setItemAsync("accessToken", newAccess);
      await SecureStore.setItemAsync("refreshToken", newRefresh);
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);

      if (user) {
        if (socket) {
          socket.removeAllListeners();
          disconnectSocket();
          setSocket(null);
        }
        const newSock = connectSocket(newAccess);
        setSocket(newSock);
        attachSocketListeners(newSock, user);
      }
    } catch (err) {
      console.error("Token refresh failed", err);
      showToast("error", "Session expired", "Please log in again.");
      await logout();
    }
  }, [user, socket, attachSocketListeners]);

  /** ----------------  Manager store joins ---------------- */
  const updateSelectedStores = useCallback(
    (stores: SelectedStore[]) => {
      selectedStoresRef.current = stores;

      if (socket?.connected && user?.role === "MANAGER") {
        stores.forEach(({ storeId, cityId, zoneId }) =>
          socket.emit("joinManagerRoom", { storeId, cityId, zoneId })
        );
      }
    },
    [socket, user]
  );

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        socket,
        login,
        logout,
        loading,
        refreshAuth,
        setUser,
        updateSelectedStores,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
