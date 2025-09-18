export const getCategories = async (axios, params) => {
    try {
        const response = await axios.get("/category", {
            params: {
                search: params.search,
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
        console.error("Failed to fetch categories:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch categories",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addCategory = async (axios, data) => {
    try {
        const response = await axios.post("category", data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create category");
        return error;
    }
};
export const updateCategory = async (axios, id, data) => {
    try {
        const response = await axios.put(`category/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update category");
        return error;
    }
};
export const deleteCategory = async (axios, id) => {
    try {
        const response = await axios.delete(`category/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete category");
        return error;
    }
};
