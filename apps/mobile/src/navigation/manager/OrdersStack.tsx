import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersListScreen from "@/screens/manager_store/OrdersList.screen";
import OrderDetailScreen from "@/screens/manager_store/OrderDetails.sreen";
import { CustomHeader } from "@/navigation/common/CommonHeader";

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { _id: string };
};

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
        component={OrdersListScreen}
        options={{ title: "Orders" }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: "Order Detail" }}
      />
    </Stack.Navigator>
  );
}
