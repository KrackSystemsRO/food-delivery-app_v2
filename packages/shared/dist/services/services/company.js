export const getCompanies = async (axios, params) => {
    try {
        const response = await axios.get("/company", {
            params: {
                search: params.search,
                type: params.type,
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
        console.error("Failed to fetch company:", error);
        return {
            result: [],
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to fetch company",
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
};
export const addCompany = async (axios, data) => {
    try {
        const response = await axios.post(`company`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to create company");
        return error;
    }
};
export const updateCompany = async (axios, id, data) => {
    try {
        const response = await axios.put(`company/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete company");
        return error;
    }
};
export const deleteCompany = async (axios, id) => {
    try {
        const response = await axios.delete(`company/${id}`);
        return response.data;
    }
    catch (error) {
        console.info("Failed to delete company");
        return error;
    }
};
