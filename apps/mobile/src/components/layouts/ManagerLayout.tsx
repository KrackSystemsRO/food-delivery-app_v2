import React, { useCallback } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrdersListScreen from "@/screens/manager_store/OrdersList.screen";
import ProductsScreen from "@/screens/manager_store/ProductManager.screen";
import AddProductScreen from "@/screens/manager_store/AddProduct.screen";
import EditProductScreen from "@/screens/manager_store/EditProduct.screen";
import OrderDetailScreen from "@/screens/manager_store/OrderDetails.sreen";
import { useAuth } from "@/context/authContext";
import { Types } from "@my-monorepo/shared";

/* ------------------ Types ------------------ */
export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { _id: string };
};
export type ProductsStackParamList = {
  ProductsMain: undefined;
  AddProduct: undefined;
  EditProduct: { product: Types.Product.ProductType };
};
type AccountStackParamList = { AccountMain: undefined };

export type ManagerTabsParamList = {
  Orders: undefined;
  Products: undefined;
  Account: undefined;
};

/* ------------------ Account Screen ------------------ */
const AccountScreen: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
      }}
    >
      <Text>
        {user?.first_name} {user?.last_name}
      </Text>
      <Button mode="text" onPress={logout}>
        Logout
      </Button>
    </View>
  );
};

/* ------------------ Stack Navigators ------------------ */
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const OrdersStackScreen = () => (
  <OrdersStack.Navigator screenOptions={{ headerShown: true }}>
    <OrdersStack.Screen
      name="OrdersList"
      component={OrdersListScreen}
      options={{ title: "Orders" }}
    />
    <OrdersStack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={{ title: "Order Detail" }}
    />
  </OrdersStack.Navigator>
);

const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();

const ProductsStackScreen = () => (
  <ProductsStack.Navigator screenOptions={{ headerShown: true }}>
    <ProductsStack.Screen
      name="ProductsMain"
      component={ProductsScreen}
      options={{ title: "Products" }}
    />
    <ProductsStack.Screen
      name="AddProduct"
      component={AddProductScreen}
      options={{ title: "Add Product" }}
    />
    <ProductsStack.Screen
      name="EditProduct"
      component={EditProductScreen}
      options={{ title: "Edit Product" }}
    />
  </ProductsStack.Navigator>
);

const AccountStack = createNativeStackNavigator<AccountStackParamList>();

const AccountStackScreen = () => (
  <AccountStack.Navigator screenOptions={{ headerShown: true }}>
    <AccountStack.Screen
      name="AccountMain"
      component={AccountScreen}
      options={{ title: "Account" }}
    />
  </AccountStack.Navigator>
);
/* ------------------ Bottom Tabs ------------------ */
const Tab = createBottomTabNavigator<ManagerTabsParamList>();

export default function ManagerLayout() {
  const getTabIcon = useCallback((routeName: keyof ManagerTabsParamList) => {
    switch (routeName) {
      case "Orders":
        return "list";
      case "Products":
        return "cube";
      case "Account":
        return "person";
    }
  }, []);

  const screenOptions = useCallback(
    ({
      route,
    }: {
      route: { name: keyof ManagerTabsParamList };
    }): BottomTabNavigationOptions => ({
      tabBarIcon: ({ color, size }) => (
        <Ionicons name={getTabIcon(route.name)} size={size} color={color} />
      ),
      headerShown: false,
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
    }),
    [getTabIcon]
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Orders"
        component={OrdersStackScreen}
        options={{ title: "Orders" }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsStackScreen}
        options={{ title: "Products" }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
        options={{ title: "Account" }}
      />
    </Tab.Navigator>
  );
}
