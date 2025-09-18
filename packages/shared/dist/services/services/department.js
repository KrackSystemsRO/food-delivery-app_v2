export const getDepartments = async (axios, params) => {
    try {
        const response = await axios.get("/department", {
            params: {
                search: params.search,
                is_active: params.is_active,
                company: params.company,
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
        console.error("Failed to fetch departments:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch departments",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addDepartment = async (axios, data) => {
    try {
        const response = await axios.post(`department`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create department");
        return error;
    }
};
export const updateDepartment = async (axios, id, data) => {
    try {
        const response = await axios.put(`department/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update department");
        return error;
    }
};
export const deleteDepartment = async (axios, id) => {
    try {
        const response = await axios.delete(`department/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete department");
        return error;
    }
};
