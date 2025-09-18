import authorizedAxios from "@/utils/request/authorizedRequest";
import type { Types } from "@my-monorepo/shared";

export interface GetRecipeParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: keyof Types.Recipe.RecipeType;
  order?: "asc" | "desc";
}

export interface GetRecipesResponse {
  status: number;
  message: string;
  result: Types.Recipe.RecipeType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getRecipes = async (
  params: GetRecipeParams
): Promise<GetRecipesResponse> => {
  try {
    const response = await authorizedAxios.get("/recipe", {
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
    console.error("Failed to fetch recipes:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch recipes",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

export const addRecipe = async (data: Types.Recipe.RecipeForm) => {
  try {
    const response = await authorizedAxios.post("/recipe", data);
    return response.data;
  } catch (error) {
    console.info("Failed to create recipe");
    return error;
  }
};

export const updateRecipe = async (
  id: string,
  data: Types.Recipe.RecipeForm
) => {
  try {
    const response = await authorizedAxios.put(`/recipe/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update recipe");
    return error;
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`/recipe/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete recipe");
    return error;
  }
};
