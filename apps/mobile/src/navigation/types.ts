import { StoresStackParamList } from "@/types/navigation.type";
import { Types } from "@my-monorepo/shared";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ClientTabsParamList = {
  Home: undefined;
  StoresTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
  OrdersTab: undefined;
  OrdersClient: undefined;
};

export type ClientStacks = {
  Stores: StoresStackParamList;
};

export type CourierOrdersStackParamList = {
  Orders: undefined;
  DeliveryDetail: { order: Types.Order.OrderType };
};

export type CourierTabsParamList = {
  OrdersTab: undefined;
  DeliveriesTab: undefined;
  ProfileTab: undefined;
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { _id: string };
};

export type OrderDetailProps = NativeStackScreenProps<
  OrdersStackParamList,
  "OrderDetail"
>;

export type ProductsStackParamList = {
  ProductsMain: undefined;
  AddProduct: undefined;
  EditProduct: { product: Types.Product.ProductType };
};

export type AccountStackParamList = { AccountMain: undefined };

export type ManagerTabsParamList = {
  Orders: undefined;
  Products: undefined;
  Profile: undefined;
};
