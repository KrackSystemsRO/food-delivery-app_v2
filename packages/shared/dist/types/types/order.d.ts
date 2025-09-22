import { UserType } from "./user";
interface BaseOrderItem {
    quantity: number;
    observations?: string;
}
interface BaseDeliveryLocation {
    lat: number;
    lng: number;
    address: string;
}
export interface OrderItemType extends BaseOrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        image: string;
        available: boolean;
        price: number;
    };
}
export interface OrderType {
    _id: string;
    id: string;
    user: UserType;
    store: {
        _id: string;
        name: string;
        is_open: boolean;
    };
    items: OrderItemType[];
    total: number;
    status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled";
    deliveryLocation: BaseDeliveryLocation;
    createdAt: string;
    updatedAt: string;
    orderId: number;
    __v: number;
}
export interface OrdersResponse {
    status: number;
    message: string;
    result: OrderType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export interface OrderForm {
    user: string;
    store: string;
    items: (BaseOrderItem & {
        product: string;
    })[];
    total: number;
    status?: "pending" | "preparing" | "on_the_way" | "delivered" | "cancelled";
    deliveryLocation: BaseDeliveryLocation;
}
export {};
