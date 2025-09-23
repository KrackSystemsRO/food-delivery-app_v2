import { ProductType } from "./product";
import { StoreType } from "./store";
import { UserType } from "./user";

// ---- Base Interfaces ----
interface BaseOrderItem {
  quantity: number;
  observations?: string;
}

interface BaseDeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

// ---- Main Types ----
export interface OrderStatus {
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled";
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
  store: StoreType;
  items: OrderItemType[];
  total: number;
  status: OrderStatus["status"];
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

// ---- Form ----
export interface OrderForm {
  _id?: string;
  user: UserType; // user ID
  store: StoreType; // store ID
  items: OrderItemType[]; // product IDs only
  total: number;
  status?: OrderStatus["status"];
  deliveryLocation: BaseDeliveryLocation;
}
