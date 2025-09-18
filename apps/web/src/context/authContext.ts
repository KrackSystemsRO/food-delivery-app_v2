import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import authorizedAxios from "@/utils/request/authorizedRequest";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";
import { Types, Services } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: Types.User.UserType | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<Types.User.UserType | null>>;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<Types.User.UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTokensAndUser = async () => {
      const storedAccessToken = Cookies.get("accessToken") || null;
      const storedRefreshToken = Cookies.get("refreshToken") || null;

      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);

      if (storedAccessToken) {
        try {
          const userDetails = await Services.User.getUserDetails(axiosInstance);
          if (userDetails?.result) setUser(userDetails.result);
          else setUser(null);
        } catch (err) {
          console.error("Failed to load user details", err);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadTokensAndUser();
  }, []);

  const login = async (newAccessToken: string, newRefreshToken: string) => {
    // Set cookies
    Cookies.set("accessToken", newAccessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", newRefreshToken, {
      secure: true,
      sameSite: "strict",
    });

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    try {
      const userDetails = await Services.User.getUserDetails(axiosInstance);
      if (userDetails?.result) setUser(userDetails.result);
      else setUser(null);
    } catch (err) {
      console.error("Login: failed to get user details", err);
    }
  };

  const logout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    navigate("/login", { replace: true });

    showToast("success", "Logged out", "You have been logged out.");
  };

  const refreshAuth = async () => {
    const currentRefreshToken = Cookies.get("refreshToken");
    if (!currentRefreshToken) return;

    try {
      const response = await authorizedAxios.get("/refresh-token");
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      Cookies.set("accessToken", newAccessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", newRefreshToken, {
        secure: true,
        sameSite: "strict",
      });

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    } catch (error) {
      console.error("Token refresh failed", error);
      showToast("error", "Session expired", "Please log in again.");
      await logout();
    }
  };

  const contextValue = React.useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      login,
      logout,
      loading,
      refreshAuth,
      setUser,
      setAccessToken,
      setRefreshToken,
    }),
    [accessToken, refreshToken, user, loading]
  );

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};
