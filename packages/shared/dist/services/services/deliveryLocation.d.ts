import type { AxiosInstance } from "axios";
import type { Types } from "../../index";
export interface GetDeliveryLocationParams {
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: keyof Types.DeliveryLocation.DeliveryLocation;
    order?: "asc" | "desc";
}
export interface GetDeliveryLocationsResponse {
    status: number;
    message: string;
    result: Types.DeliveryLocation.DeliveryLocation[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export declare const getDeliveryLocations: (axios: AxiosInstance, params: GetDeliveryLocationParams) => Promise<GetDeliveryLocationsResponse>;
export declare const addDeliveryLocation: (axios: AxiosInstance, data: Types.DeliveryLocation.DeliveryLocation) => Promise<any>;
export declare const updateDeliveryLocation: (axios: AxiosInstance, id: string, data: Partial<Types.DeliveryLocation.DeliveryLocation>) => Promise<any>;
export declare const deleteDeliveryLocation: (axios: AxiosInstance, id: string) => Promise<any>;
