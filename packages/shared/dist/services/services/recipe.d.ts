import type { Types } from "../../index";
import { AxiosInstance } from "axios";
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
export declare const getRecipes: (axios: AxiosInstance, params: GetRecipeParams) => Promise<GetRecipesResponse>;
export declare const addRecipe: (axios: AxiosInstance, data: Types.Recipe.RecipeForm) => Promise<any>;
export declare const updateRecipe: (axios: AxiosInstance, id: string, data: Types.Recipe.RecipeForm) => Promise<any>;
export declare const deleteRecipe: (axios: AxiosInstance, id: string) => Promise<any>;
