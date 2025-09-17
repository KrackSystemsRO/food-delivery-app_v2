import axios from "axios";
import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig?.extra ?? {};

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
