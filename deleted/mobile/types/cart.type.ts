import { StoreType } from "./store.type";

export type CartItemType = {
  product: string;
  name?: string;
  price: number;
  quantity: number;
  observations?: string;
  image?: string;
};

export type CartStateType = {
  store: StoreType | null;
  items: CartItemType[];
};
