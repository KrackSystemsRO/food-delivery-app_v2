import { Types } from "@my-monorepo/shared";

export type AppStackParamList = {
  Login: undefined;
  Register: undefined;
  Recover: undefined;
  Foodie: undefined;
  Cart: undefined;
};

export type StoresStackParamList = {
  Stores: undefined;
  StoreDetails: { store: Types.Store.StoreType };
  ProductDetails: { product: Types.Product.ProductType };
};
