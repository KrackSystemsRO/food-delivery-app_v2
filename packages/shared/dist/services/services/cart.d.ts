import { Types } from "../../index";
import { AxiosInstance } from "axios";
export declare const addToCart: (axios: AxiosInstance, { product, quantity, store, observations, }: {
    product: string;
    quantity: number;
    store: string;
    observations?: string;
}) => unknown;
export declare const fetchCart: (axios: AxiosInstance) => unknown;
export declare const updateCartItemQuantity: (axios: AxiosInstance, product: string, quantity: number, store: Types.Store.StoreType) => unknown;
export declare const removeItemFromCart: (axios: AxiosInstance, product: string) => unknown;
export declare const clearCart: (axios: AxiosInstance) => unknown;
