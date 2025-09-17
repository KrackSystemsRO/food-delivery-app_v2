import type { IngredientForm, IngredientType } from "@/types/ingredient.type";
import authorizedAxios from "@/utils/request/authorizedRequest";

export interface GetIngredientParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: keyof IngredientType;
  order?: "asc" | "desc";
}

export interface GetIngredientsResponse {
  status: number;
  message: string;
  result: IngredientType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getIngredients = async (
  params: GetIngredientParams
): Promise<GetIngredientsResponse> => {
  try {
    const response = await authorizedAxios.get("/ingredient", {
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
  } catch (error: any) {
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

export const addIngredient = async (data: IngredientForm) => {
  try {
    const response = await authorizedAxios.post("/ingredient", data);
    return response.data;
  } catch (error) {
    console.info("Failed to create ingredient");
    return error;
  }
};

export const updateIngredient = async (id: string, data: IngredientForm) => {
  try {
    const response = await authorizedAxios.put(`/ingredient/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update ingredient");
    return error;
  }
};

export const deleteIngredient = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`/ingredient/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete ingredient");
    return error;
  }
};

export const checkIngredient = async (name: string) => {
  const res = await authorizedAxios.get(`/ingredient/check`, {
    params: { name },
  });
  console.log(res);
  return res.data as { exists: boolean; ingredient?: IngredientType };
};
