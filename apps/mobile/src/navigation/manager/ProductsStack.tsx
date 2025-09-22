import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsScreen from "@/screens/manager_store/ProductManager.screen";
import AddProductScreen from "@/screens/manager_store/AddProduct.screen";
import EditProductScreen from "@/screens/manager_store/EditProduct.screen";
import { CustomHeader } from "@/navigation/common/CommonHeader";
import { Types } from "@my-monorepo/shared";

export type ProductsStackParamList = {
  ProductsMain: undefined;
  AddProduct: undefined;
  EditProduct: { product: Types.Product.ProductType };
};

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export default function ProductsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="ProductsMain"
        component={ProductsScreen}
        options={{ title: "Products" }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: "Add Product" }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ title: "Edit Product" }}
      />
    </Stack.Navigator>
  );
}
