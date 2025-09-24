import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import OrdersStack from "./OrdersStack";
import ProductsStack from "./ProductsStack";
import ProfileStack from "@/navigation/common/ProfileStack";
import { getManagerTabIcon } from "@/navigation/common/TabIcons";
import ManagerLandingScreen from "@/screens/manager/ManagerLanding";
import { ManagerTabsParamList } from "../types";

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
        name="ManagerLandingStack"
        component={ManagerLandingScreen}
        options={{
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="OrdersStack"
        component={OrdersStack}
        options={{ title: "Orders", tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{ title: "Products", tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ title: "Profile", tabBarStyle: { display: "none" } }}
      />
    </Tab.Navigator>
  );
}
