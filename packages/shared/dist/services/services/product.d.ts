import type { Types } from "../../index";
import { AxiosInstance } from "axios";
export interface GetProductParams {
    search?: string;
    product_type?: "prepared_food" | "grocery";
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: keyof Types.Product.ProductType;
    order?: "asc" | "desc";
}
export interface GetProductsResponse {
    status: number;
    message: string;
    result: Types.Product.ProductType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export interface CreateProductPayload {
    name: string;
    description?: string;
    store: Types.Store.StoreType | null;
    price: number;
    is_active: boolean;
    product_type: "prepared_food" | "grocery";
    categories: string[];
    ingredients: {
        ingredient: string;
        quantity: number;
        unit: string;
    }[];
}
export declare const getProducts: (axios: AxiosInstance, params: GetProductParams) => Promise<GetProductsResponse>;
export declare const addProduct: (axios: AxiosInstance, data: Types.Product.ProductForm | CreateProductPayload) => unknown;
export declare const updateProduct: (axios: AxiosInstance, id: string, data: Types.Product.ProductForm) => unknown;
export declare const deleteProduct: (axios: AxiosInstance, id: string) => unknown;
export declare const getListProductsStore: (axios: AxiosInstance, idStore: string) => unknown;
export declare const getUserProductsStore: (axios: AxiosInstance, storeId: string | string[]) => unknown;
export declare const getUserProductsStores: (axios: AxiosInstance, stores: Types.Store.StoreType[]) => unknown;
