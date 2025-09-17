import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/client/Cart";
import { useTranslation } from "react-i18next";

const CartStack = createNativeStackNavigator();

export default function CartStackNavigator() {
  const { t } = useTranslation();
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <CartStack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: t("common.heading.cart.your_cart") }}
      />
    </CartStack.Navigator>
  );
}
