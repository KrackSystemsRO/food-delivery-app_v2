import { Types } from "../../index";
import { AxiosInstance } from "axios";
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
export declare const getAllergens: (axios: AxiosInstance, params: GetAllergenParams) => Promise<GetAllergensResponse>;
export declare const addAllergen: (axios: AxiosInstance, data: Types.Allergen.AllergenForm) => unknown;
export declare const updateAllergen: (axios: AxiosInstance, id: string, data: Types.Allergen.AllergenForm) => unknown;
export declare const deleteAllergen: (axios: AxiosInstance, id: string) => unknown;
