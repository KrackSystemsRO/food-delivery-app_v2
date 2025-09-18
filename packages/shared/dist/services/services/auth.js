export const login = async (axios, data) => {
    try {
        const response = await axios.post("/login", data);
        return response.data;
    }
    catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};
export const logout = async (logoutFn) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (logoutFn)
        await logoutFn();
};
export async function register(axios, { email, firstName, lastName, password, }) {
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
    }
    catch (error) {
        const message = error.response?.data?.message || "Registration failed";
        throw new Error(message);
    }
}
export async function forgotPassword(axios, email) {
    try {
        await axios.post("/forgot-password", { email });
    }
    catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to send recovery email");
    }
}
export async function resetPassword(axios, { token, new_password, }) {
    try {
        const response = await axios.post("/reset-password", {
            token,
            new_password,
        });
        if (response.status !== 200) {
            throw new Error(response.data.message || "Failed to reset password");
        }
        return response.data;
    }
    catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to reset password");
    }
}
