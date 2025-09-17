import type { StoreForm, StoreType } from "@/types/store.type";
import authorizedAxios from "@/utils/request/authorizedRequest";

export interface GetStoreParams {
  search?: string;
  company?: string;
  admin?: string;
  type?: string;
  is_active?: boolean;
  is_open?: boolean;
  page?: number;
  limit?: number;
  sort_by?: keyof StoreType;
  order?: "asc" | "desc";
}

export interface GetStoresResponse {
  status: number;
  message: string;
  result: StoreType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getStores = async (
  params: GetStoreParams
): Promise<GetStoresResponse> => {
  try {
    const response = await authorizedAxios.get("/store", {
      params: {
        search: params.search,
        company: params.company,
        admin: params.admin,
        type: params.type,
        is_active: params.is_active,
        is_open: params.is_open,
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
  } catch (error: any) {
    console.error("Failed to fetch stores:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch stores",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

export const addStore = async (data: StoreForm) => {
  try {
    const response = await authorizedAxios.post(`/store`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to create store");
    return error;
  }
};

export const updateStore = async (id: string, data: StoreForm) => {
  try {
    const response = await authorizedAxios.put(`/store/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update store");
    return error;
  }
};

export const deleteStore = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`/store/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete store");
    return error;
  }
};
