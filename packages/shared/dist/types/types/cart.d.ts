import { StoreType } from "./store";
export interface CartItemType {
    product: string;
    name?: string;
    price: number;
    quantity: number;
    observations?: string;
    image?: string;
}
export interface CartStateType {
    store: StoreType | null;
    items: CartItemType[];
}
