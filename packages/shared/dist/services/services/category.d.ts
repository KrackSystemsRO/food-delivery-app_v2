import { Types } from "../../index";
import { AxiosInstance } from "axios";
export interface GetCategoryParams {
    search?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: keyof Types.Category.CategoryType;
    order?: "asc" | "desc";
}
export interface GetCategoriesResponse {
    status: number;
    message: string;
    result: Types.Category.CategoryType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export declare const getCategories: (axios: AxiosInstance, params: GetCategoryParams) => Promise<GetCategoriesResponse>;
export declare const addCategory: (axios: AxiosInstance, data: Types.Category.CategoryForm) => unknown;
export declare const updateCategory: (axios: AxiosInstance, id: string, data: Types.Category.CategoryForm) => unknown;
export declare const deleteCategory: (axios: AxiosInstance, id: string) => unknown;
