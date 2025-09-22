import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import OrdersListScreen from "@/screens/manager/OrdersList.screen";
import OrderDetailScreen from "@/screens/manager/OrderDetails.screen";
import { CustomHeader } from "@/navigation/common/CommonHeader";

/* ------------------ Types ------------------ */
export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { _id: string }; // singular, matches screen
};

/* Properly type the screen props for OrderDetailScreen */
export type OrderDetailProps = NativeStackScreenProps<
  OrdersStackParamList,
  "OrderDetail"
>;

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
