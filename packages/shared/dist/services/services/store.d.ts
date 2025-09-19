import type { Types } from "../../index";
import { AxiosInstance } from "axios";
export interface GetStoresResponse {
    status: number;
    message: string;
    result: Types.Store.StoreType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export declare const getStores: (axios: AxiosInstance, params: Types.Store.StoreListQuery) => Promise<GetStoresResponse>;
export declare const addStore: (axios: AxiosInstance, data: Types.Store.StoreForm) => unknown;
export declare const updateStore: (axios: AxiosInstance, id: string, data: Types.Store.StoreForm) => unknown;
export declare const deleteStore: (axios: AxiosInstance, id: string) => unknown;
