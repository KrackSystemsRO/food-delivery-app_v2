import { useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import OrdersStack from "./OrdersStack";
import DeliveriesStack from "./DeliveriesStack";
import ProfileStack from "@/navigation/common/ProfileStack";
import { getCourierTabIcon } from "@/navigation/common/TabIcons";

export type CourierTabsParamList = {
  OrdersTab: undefined;
  DeliveriesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<CourierTabsParamList>();

export default function CourierTabs() {
  const getIcon = useCallback((name: keyof CourierTabsParamList) => {
    switch (name) {
      case "OrdersTab":
        return "assignment";
      case "DeliveriesTab":
        return "local-shipping";
      case "ProfileTab":
        return "person";
    }
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name={getCourierTabIcon(route.name)}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{ title: "Orders" }}
      />
      <Tab.Screen
        name="DeliveriesTab"
        component={DeliveriesStack}
        options={{ title: "Deliveries" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
