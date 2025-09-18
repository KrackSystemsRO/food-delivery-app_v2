export const getRecipes = async (axios, params) => {
    try {
        const response = await axios.get("/recipe", {
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
        console.error("Failed to fetch recipes:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch recipes",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addRecipe = async (axios, data) => {
    try {
        const response = await axios.post("/recipe", data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create recipe");
        return error;
    }
};
export const updateRecipe = async (axios, id, data) => {
    try {
        const response = await axios.put(`/recipe/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update recipe");
        return error;
    }
};
export const deleteRecipe = async (axios, id) => {
    try {
        const response = await axios.delete(`/recipe/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete recipe");
        return error;
    }
};
