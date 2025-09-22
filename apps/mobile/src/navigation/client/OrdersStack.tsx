import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "@/screens/client/Orders";
import OrderDetailsScreen from "@/screens/client/OrderDetails";
import { CustomHeader } from "@/navigation/common/CommonHeader";
import { OrdersStackParamList } from "../types";

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export default function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={{ title: "Orders" }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
}
