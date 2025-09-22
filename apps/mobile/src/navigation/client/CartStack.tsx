import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "@/screens/client/Cart";
// import CheckoutScreen from "@/screens/client/Checkout";
import { CustomHeader } from "@/navigation/common/CommonHeader";

const Stack = createNativeStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Cart" }}
      />
      {/* <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      /> */}
    </Stack.Navigator>
  );
}
