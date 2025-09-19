import { StoreType } from "./store";
import { UserType } from "./user";
export type OrderItemType = {
    _id: string;
    product: {
        _id: string;
        name: string;
        image: string;
        available: boolean;
    };
    quantity: number;
    observations: string;
};
export type OrderType = {
    _id: string;
    id: string;
    user: UserType;
    store: StoreType;
    items: Partial<OrderItemType[]>;
    total: number;
    status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled";
    deliveryLocation: {
        lat: number;
        lng: number;
        address: string;
    };
    createdAt: string;
    updatedAt: string;
    orderId: number;
    __v: number;
};
export type OrdersResponse = {
    status: number;
    message: string;
    result: OrderType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
};
export interface OrderForm {
    user: string;
    store: Partial<OrderType>;
    items: OrderItemType[];
    total: number;
    status?: OrderStatus;
    deliveryLocation: {
        lat: number;
        lng: number;
        address: string;
    };
}
export type OrderStatus = "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled";
