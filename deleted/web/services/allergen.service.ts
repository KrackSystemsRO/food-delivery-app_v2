import authorizedAxios from "@/utils/request/authorizedRequest";
import { Types } from "@my-monorepo/shared";
export interface GetAllergenParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: keyof Types.Allergen.AllergenType;
  order?: "asc" | "desc";
}

export interface GetAllergensResponse {
  status: number;
  message: string;
  result: Types.Allergen.AllergenType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getAllergens = async (
  params: GetAllergenParams
): Promise<GetAllergensResponse> => {
  try {
    const response = await authorizedAxios.get("/allergen", {
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
  } catch (error: any) {
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

export const addAllergen = async (data: Types.Allergen.AllergenForm) => {
  try {
    const response = await authorizedAxios.post("/allergen", data);
    return response.data;
  } catch (error) {
    console.info("Failed to create allergen");
    return error;
  }
};

export const updateAllergen = async (
  id: string,
  data: Types.Allergen.AllergenForm
) => {
  try {
    const response = await authorizedAxios.put(`/allergen/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update allergen");
    return error;
  }
};

export const deleteAllergen = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`/allergen/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete allergen");
    return error;
  }
};
