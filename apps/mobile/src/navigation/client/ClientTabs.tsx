import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import StoresStack from "./StoresStack";
import CartStack from "./CartStack";
import OrdersStack from "./OrdersStack";
import ProfileStack from "@/navigation/common/ProfileStack";
import { useCart } from "@/context/CartContext";
import { AnimatedBadge } from "@/components/animations/BadgeOnUpdate";
import { getClientTabIcon } from "@/navigation/common/TabIcons";

export type ClientTabsParamList = {
  StoresTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<ClientTabsParamList>();

export default function ClientTabs() {
  const { state: cartItems } = useCart();
  const totalQuantity = cartItems.items.reduce((t, i) => t + i.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <View>
            <MaterialIcons
              name={getClientTabIcon(route.name)}
              size={size}
              color={color}
            />
            {route.name === "CartTab" && (
              <AnimatedBadge count={totalQuantity} />
            )}
          </View>
        ),
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="StoresTab"
        component={StoresStack}
        options={{ title: "Stores" }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{ title: "Cart" }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{ title: "Orders" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
