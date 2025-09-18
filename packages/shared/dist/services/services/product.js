export const getProducts = async (axios, params) => {
    try {
        const response = await axios.get("/product", {
            params: {
                search: params.search,
                product_type: params.product_type,
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
        console.error("Failed to fetch products:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch products",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addProduct = async (axios, data) => {
    try {
        const response = await axios.post("/product", data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create product");
        return error;
    }
};
export const updateProduct = async (axios, id, data) => {
    try {
        const response = await axios.put(`/product/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to update product");
        return error;
    }
};
export const deleteProduct = async (axios, id) => {
    try {
        const response = await axios.delete(`/product/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete product");
        return error;
    }
};
export const getListProductsStore = async (axios, idStore) => {
    try {
        const response = await axios.get(`/product?store=${idStore}`);
        return response.data;
    }
    catch (error) {
        console.error("Failed to fetch products of store ", error);
        throw error;
    }
};
export const getUserProductsStore = async (axios, storeId) => {
    try {
        // Handle empty array or undefined by not adding store query
        let url = "/product";
        if (Array.isArray(storeId) && storeId.length > 0) {
            url += `?store=${storeId.join(",")}`; // join multiple IDs
        }
        else if (typeof storeId === "string" && storeId) {
            url += `?store=${storeId}`;
        }
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        console.error("Failed to fetch products of store ", error);
        throw error;
    }
};
export const getUserProductsStores = async (axios, stores) => {
    try {
        const allProducts = await Promise.all(stores.map(async (storeId) => {
            const response = await axios.get(`/product?store=${storeId._id}`);
            return response.data.result ?? [];
        }));
        return allProducts.flat();
    }
    catch (error) {
        console.error("Failed to fetch products of store ", error);
        throw error;
    }
};
