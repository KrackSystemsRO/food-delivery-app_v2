import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "@/screens/client/Orders";
import OrderDetailsScreen from "@/screens/client/Orders";
import { CustomHeader } from "@/navigation/common/CommonHeader";

const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Orders" }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
}
