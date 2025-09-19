import { AxiosInstance } from "axios";
import type { Types } from "../../index";
export interface GetOrderParams {
    _id?: string;
    search?: string;
    user?: string;
    store?: string;
    status?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: "asc" | "desc";
}
export interface GetOrdersResponse {
    result: Types.Order.OrderType[];
    status: number;
    message: string;
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export interface AcceptDenyOrderResponse {
    result: Types.Order.OrderType;
    status: number;
    message: string;
}
export declare const getOrders: (axios: AxiosInstance, params: GetOrderParams) => Promise<GetOrdersResponse>;
export declare const addOrder: (axios: AxiosInstance, data: Types.Order.OrderForm) => unknown;
export declare const updateOrder: (axios: AxiosInstance, id: string, data: Types.Order.OrderForm) => unknown;
export declare const deleteOrder: (axios: AxiosInstance, id: string) => unknown;
export declare const placeOrder: (axios: AxiosInstance, orderData: {
    store: Types.Store.StoreType;
    items: Types.Cart.CartItemType[];
    deliveryLocation: {
        lat: number;
        lng: number;
        address: string;
    };
}) => unknown;
export declare const getUserOrder: (axios: AxiosInstance) => unknown;
export declare const getOrderById: (axios: AxiosInstance, id: string) => unknown;
export declare const acceptOrder: (axios: AxiosInstance, orderId: string) => unknown;
export declare const denyOrder: (axios: AxiosInstance, orderId: string) => unknown;
export declare const getUserOrdersByStores: (axios: AxiosInstance, storesId: string[]) => unknown;
