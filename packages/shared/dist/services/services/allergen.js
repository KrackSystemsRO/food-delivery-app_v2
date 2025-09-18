export const getAllergens = async (axios, params) => {
    try {
        const response = await axios.get("/allergen", {
            params: {
                search: params.search,
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
        console.error("Failed to fetch allergens:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch allergens",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addAllergen = async (axios, data) => {
    try {
        const response = await axios.post("/allergen", data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create allergen");
        return error;
    }
};
export const updateAllergen = async (axios, id, data) => {
    try {
        const response = await axios.put(`/allergen/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update allergen");
        return error;
    }
};
export const deleteAllergen = async (axios, id) => {
    try {
        const response = await axios.delete(`/allergen/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete allergen");
        return error;
    }
};
