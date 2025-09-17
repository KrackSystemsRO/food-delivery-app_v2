import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourierOrdersPage from "@/screens/courier/CourierList.screen";
import DeliveryDetailPage from "@/screens/courier/DeliveryDetail.screen";
import { OrderType } from "@/types/order.type";

export type CourierOrdersStackParamList = {
  Orders: undefined;
  DeliveryDetail: { order: OrderType };
};

const Stack = createNativeStackNavigator<CourierOrdersStackParamList>();

export default function CourierOrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={CourierOrdersPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryDetail"
        component={DeliveryDetailPage}
        options={{ title: "Delivery Details" }}
      />
    </Stack.Navigator>
  );
}
