import axios from "axios";
import Cookies from "js-cookie";
import { showToast } from "../toast";
import { Services } from "@my-monorepo/shared";

const API_URL = import.meta.env.VITE_API_URL;
const IS_PRODUCTION = import.meta.env.VITE_STATE === "production";

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await axios.get(`${API_URL}/refresh-token`, {
          withCredentials: true,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data;

        Cookies.set("accessToken", newAccessToken, {
          secure: IS_PRODUCTION,
          sameSite: IS_PRODUCTION ? "none" : "lax",
          path: "/",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        Cookies.set("refreshToken", newRefreshToken, {
          secure: IS_PRODUCTION,
          sameSite: IS_PRODUCTION ? "none" : "lax",
          path: "/",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        showToast("error", "Session expired", "Please log in again.");
        await Services.Auth.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
