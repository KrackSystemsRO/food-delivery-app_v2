import axios from "@/utils/request/request";

export interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axios.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = async (logoutFn?: () => Promise<void>) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (logoutFn) await logoutFn();
};

export async function register({
  email,
  firstName,
  lastName,
  password,
}: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const response = await axios.post(`/register`, {
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    });

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || "Registration failed";
    throw new Error(message);
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await axios.post("/forgot-password", { email });
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to send recovery email"
    );
  }
}

export async function resetPassword({
  token,
  new_password,
}: {
  token: string;
  new_password: string;
}) {
  try {
    const response = await axios.post("/reset-password", {
      token,
      new_password,
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to reset password");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to reset password"
    );
  }
}
