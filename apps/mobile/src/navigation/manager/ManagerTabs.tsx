import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import OrdersStack from "./OrdersStack";
import ProductsStack from "./ProductsStack";
import ProfileStack from "@/navigation/common/ProfileStack";
import { getManagerTabIcon } from "@/navigation/common/TabIcons";

export type ManagerTabsParamList = {
  Orders: undefined;
  Products: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<ManagerTabsParamList>();

export default function ManagerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={getManagerTabIcon(route.name)}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{ title: "Orders" }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsStack}
        options={{ title: "Products" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
