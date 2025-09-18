import { Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

export interface GetIngredientParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface GetIngredientsResponse {
  result: Types.Ingredient.IngredientType[];
  status: number;
  message: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getIngredients = async (
  params: GetIngredientParams = {}
): Promise<GetIngredientsResponse> => {
  try {
    const response = await axiosInstance.get("/ingredient", {
      params: {
        search: params.search,
        is_active: params.is_active,
        page: params.page,
        limit: params.limit,
        sort_by: params.sort_by,
        order: params.order,
      },
    });

    const results = Array.isArray(response.data.result)
      ? response.data.result
      : [];

    const mappedIngredients: Types.Ingredient.IngredientType[] = results.map(
      (i: any) => ({
        _id: i._id,
        name: i.name,
        description: i.description || "",
        allergens: i.allergens || [],
        nutritionalInfo: {
          calories: i.nutritionalInfo?.calories ?? 0,
          protein: i.nutritionalInfo?.protein ?? 0,
          fat: i.nutritionalInfo?.fat ?? 0,
          fiber: i.nutritionalInfo?.fiber ?? 0,
          sugar: i.nutritionalInfo?.sugar ?? 0,
        },
        unit: (i.unit as "gram" | "piece" | "liter") || "gram",
        is_active: i.is_active ?? true,
      })
    );

    return {
      result: mappedIngredients || [],
      status: response.status,
      message: response.data.message || "",
      totalCount: response.data.totalCount || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || 1,
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
