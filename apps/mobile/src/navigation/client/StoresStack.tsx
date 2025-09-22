import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StoresScreen from "@/screens/client/Store";
import StoreDetailsScreen from "@/screens/client/StoreDetails";
import ProductDetailsScreen from "@/screens/client/ProductDetails";
import { CustomHeader } from "@/navigation/common/CommonHeader";
import { StoresStackParamList } from "@/types/navigation.type";

const Stack = createNativeStackNavigator<StoresStackParamList>();

export default function StoresStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="Stores"
        component={StoresScreen}
        options={{ title: "Stores" }}
      />
      <Stack.Screen
        name="StoreDetails"
        component={StoreDetailsScreen}
        options={{ title: "Store Details" }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Product Details" }}
      />
    </Stack.Navigator>
  );
}
