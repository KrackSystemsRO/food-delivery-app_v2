import axiosInstance from "@/utils/request/authorizedRequest";

export interface GetCategoryParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface CategoryType {
  _id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

export interface GetCategoriesResponse {
  result: CategoryType[];
  status: number;
  message: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export type CreateCategoryResponse = {
  status: number;
  message: string;
  result: CategoryType;
};

export const getCategories = async (
  params: GetCategoryParams = {}
): Promise<GetCategoriesResponse> => {
  try {
    const response = await axiosInstance.get("/category", {
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
      result: response.data.result || [],
      status: response.data.status,
      message: response.data.message || "",
      totalCount: response.data.totalCount || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || 1,
    };
  } catch (error: any) {
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

export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<CategoryType> => {
  const res = await axiosInstance.post<CreateCategoryResponse>(
    "/category",
    data
  );
  return res.data.result;
};
