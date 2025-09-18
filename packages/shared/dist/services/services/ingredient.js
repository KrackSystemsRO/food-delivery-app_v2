export const getIngredients = async (axios, params) => {
    try {
        const response = await axios.get("/ingredient", {
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
        console.error("Failed to fetch ingredients:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch ingredients",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addIngredient = async (axios, data) => {
    try {
        const response = await axios.post("/ingredient", data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create ingredient");
        return error;
    }
};
export const updateIngredient = async (axios, id, data) => {
    try {
        const response = await axios.put(`/ingredient/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update ingredient");
        return error;
    }
};
export const deleteIngredient = async (axios, id) => {
    try {
        const response = await axios.delete(`/ingredient/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete ingredient");
        return error;
    }
};
export const checkIngredient = async (axios, name) => {
    try {
        const res = await axios.get(`/ingredient/check`, {
            params: { name },
        });
        return res.data;
    }
    catch (err) {
        console.info("Failed to check ingredient");
        return err;
    }
};
