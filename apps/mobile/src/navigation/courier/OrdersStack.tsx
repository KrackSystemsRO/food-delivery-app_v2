import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourierOrdersPage from "@/screens/courier/CourierList";
import DeliveryDetailPage from "@/screens/courier/DeliveryDetail";
import { CustomHeader } from "@/navigation/common/CommonHeader";
import { Types } from "@my-monorepo/shared";

export type CourierOrdersStackParamList = {
  Orders: undefined;
  DeliveryDetail: { order: Types.Order.OrderType };
};

const Stack = createNativeStackNavigator<CourierOrdersStackParamList>();

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
        component={CourierOrdersPage}
        options={{ title: "Available Orders" }}
      />
      <Stack.Screen
        name="DeliveryDetail"
        component={DeliveryDetailPage}
        options={{ title: "Delivery Detail" }}
      />
    </Stack.Navigator>
  );
}
