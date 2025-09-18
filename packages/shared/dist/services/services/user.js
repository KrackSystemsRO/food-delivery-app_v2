export const getUserDetails = async (axios) => {
    try {
        const response = await axios.get("/user");
        return response.data;
    }
    catch (error) {
        console.info("You are not logged in yet.");
        return error;
    }
};
export const getUsers = async (axios, params) => {
    try {
        const response = await axios.get("/users", {
            params: {
                search: params.search,
                role: params.role,
                is_active: params.is_active,
                page: params.page,
                limit: params.limit,
                sort_by: params.sort_by,
                order: params.order,
            },
        });
        return {
            result: response.data.result,
            status: response.status,
            message: response.data.message,
            totalCount: response.data.totalCount,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
        };
    }
    catch (error) {
        console.error("Failed to fetch users:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch users",
        };
    }
};
export const addUser = async (axios, data) => {
    try {
        const response = await axios.post(`user`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create user");
        return error;
    }
};
export const updateUser = async (axios, id, data) => {
    try {
        const response = await axios.put(`user/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete user");
        return error;
    }
};
export const deleteUser = async (axios, id) => {
    try {
        const response = await axios.delete(`user/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete user");
        return error;
    }
};
