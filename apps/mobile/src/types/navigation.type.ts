import { ProductType } from "../../../../deleted/mobile/types/product.type";
import { StoreType } from "../../../../deleted/mobile/types/store.type";

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
