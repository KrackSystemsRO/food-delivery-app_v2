import { Types } from "../../index";
import { AxiosInstance } from "axios";
export declare const addToCart: (axios: AxiosInstance, { product, quantity, store, observations, }: {
    product: string;
    quantity: number;
    store: string;
    observations?: string;
}) => Promise<{
    success: boolean;
    data: any;
    message?: undefined;
    status?: undefined;
} | {
    success: boolean;
    message: any;
    status: any;
    data?: undefined;
}>;
export declare const fetchCart: (axios: AxiosInstance) => Promise<any>;
export declare const updateCartItemQuantity: (axios: AxiosInstance, product: string, quantity: number, store: Types.Store.StoreType) => Promise<any>;
export declare const removeItemFromCart: (axios: AxiosInstance, product: string) => Promise<any>;
export declare const clearCart: (axios: AxiosInstance) => Promise<any>;
