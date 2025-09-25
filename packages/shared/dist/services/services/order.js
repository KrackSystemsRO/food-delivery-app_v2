export const getOrders = async (axios, params) => {
    try {
        const response = await axios.get("/order", {
            params: {
                search: params.search,
                user: params.user,
                store: params.store,
                status: params.status,
                date: params.date,
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
        console.error("Failed to fetch orders:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch orders",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addOrder = async (axios, data) => {
    try {
        const response = await axios.post("/order", data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create order");
        return error;
    }
};
export const updateOrder = async (axios, id, data) => {
    try {
        const response = await axios.put(`/order/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update order");
        return error;
    }
};
export const deleteOrder = async (axios, id) => {
    try {
        const response = await axios.delete(`/order/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete order");
        return error;
    }
};
export const placeOrder = async (axios, orderData) => {
    try {
        const response = await axios.post("/order", orderData);
        return response.data;
    }
    catch (error) {
        console.error("Failed to place order to store ", error);
        throw error;
    }
};
export const getUserOrder = async (axios) => {
    try {
        const response = await axios.get("/order");
        return response.data;
    }
    catch (error) {
        console.error("Failed to fetch orders of store ", error);
        throw error;
    }
};
export const getOrderById = async (axios, id) => {
    try {
        const response = await axios.get(`/order/${id}`);
        return response.data;
    }
    catch (error) {
        console.error("Failed to fetch orders of store ", error);
        throw error;
    }
};
export const acceptOrder = async (axios, orderId) => {
    try {
        const response = await axios.post("/order/accept-order", {
            orderId,
        });
        return response.data;
    }
    catch (error) {
        console.error("Failed to accept order of store ", error);
        throw error;
    }
};
export const denyOrder = async (axios, orderId) => {
    try {
        const response = await axios.post("/order/deny-order", { orderId });
        return response.data;
    }
    catch (error) {
        console.error("Failed to accept order of store ", error);
        throw error;
    }
};
export const getUserOrdersByStores = async (axios, storesId) => {
    try {
        const response = await axios.post(`/order/get-store`, {
            stores: storesId,
        });
        return response.data.result ?? [];
    }
    catch (error) {
        console.error("Failed to fetch orders of store ", error);
        throw error;
    }
};
