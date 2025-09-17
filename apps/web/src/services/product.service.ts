import type { ProductForm, ProductType } from "@/types/product.type";
import authorizedAxios from "@/utils/request/authorizedRequest";

export interface GetProductParams {
  search?: string;
  product_type?: "prepared_food" | "grocery";
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: keyof ProductType;
  order?: "asc" | "desc";
}

export interface GetProductsResponse {
  status: number;
  message: string;
  result: ProductType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Fetch products
export const getProducts = async (
  params: GetProductParams
): Promise<GetProductsResponse> => {
  try {
    const response = await authorizedAxios.get("/product", {
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
  } catch (error: any) {
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

export const addProduct = async (data: ProductForm) => {
  try {
    const response = await authorizedAxios.post("/product", data);
    return response.data;
  } catch (error) {
    console.info("Failed to create product");
    return error;
  }
};

export const updateProduct = async (id: string, data: ProductForm) => {
  try {
    const response = await authorizedAxios.put(`/product/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update product");
    return error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete product");
    return error;
  }
};
