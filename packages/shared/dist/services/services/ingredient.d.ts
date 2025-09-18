import type { Types } from "../../index";
import { AxiosInstance } from "axios";
export interface GetIngredientParams {
    search?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: keyof Types.Ingredient.IngredientType;
    order?: "asc" | "desc";
}
export interface GetIngredientsResponse {
    status: number;
    message: string;
    result: Types.Ingredient.IngredientType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export declare const getIngredients: (axios: AxiosInstance, params: GetIngredientParams) => Promise<GetIngredientsResponse>;
export declare const addIngredient: (axios: AxiosInstance, data: Types.Ingredient.IngredientForm) => Promise<any>;
export declare const updateIngredient: (axios: AxiosInstance, id: string, data: Types.Ingredient.IngredientForm) => Promise<any>;
export declare const deleteIngredient: (axios: AxiosInstance, id: string) => Promise<any>;
export declare const checkIngredient: (axios: AxiosInstance, name: string) => Promise<unknown>;
