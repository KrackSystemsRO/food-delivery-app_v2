import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyDeliveriesPage from "@/screens/courier/MyDeliveries";
import { CustomHeader } from "@/navigation/common/CommonHeader";

const Stack = createNativeStackNavigator();

export default function DeliveriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="Deliveries"
        component={MyDeliveriesPage}
        options={{ title: "My Deliveries" }}
      />
    </Stack.Navigator>
  );
}
