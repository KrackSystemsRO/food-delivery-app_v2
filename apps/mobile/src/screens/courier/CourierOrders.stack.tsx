import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourierOrdersPage from "@/screens/courier/CourierList.screen";
import DeliveryDetailPage from "@/screens/courier/DeliveryDetail.screen";
import { Types } from "@my-monorepo/shared";

export type CourierOrdersStackParamList = {
  Orders: undefined;
  DeliveryDetail: { order: Types.Order.OrderType };
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
