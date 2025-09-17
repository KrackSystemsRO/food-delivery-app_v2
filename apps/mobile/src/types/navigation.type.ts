import { ProductType } from "./product.type";
import { StoreType } from "./store.type";

export type AppStackParamList = {
  Login: undefined;
  Register: undefined;
  Recover: undefined;
  Foodie: undefined;
  Cart: undefined;
};

export type StoresStackParamList = {
  Stores: undefined;
  StoreDetails: { store: StoreType };
  ProductDetails: { product: ProductType };
};
