// ---------- CRUD services ----------
export const getDeliveryLocations = async (axios, params) => {
    try {
        const response = await axios.get("/locations", {
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
        console.error("Failed to fetch delivery locations:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch delivery locations",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addDeliveryLocation = async (axios, data) => {
    try {
        const response = await axios.post("/locations", data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create delivery location");
        return error;
    }
};
export const updateDeliveryLocation = async (axios, id, data) => {
    try {
        const response = await axios.put(`/locations/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update delivery location");
        return error;
    }
};
export const deleteDeliveryLocation = async (axios, id) => {
    try {
        const response = await axios.delete(`/locations/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete delivery location");
        return error;
    }
};
