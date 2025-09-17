import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import MyDeliveriesPage from "@/screens/courier/MyDeliveries";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import { useAuth } from "@/context/authContext";
import CourierOrdersStack from "@/screens/courier/CourierOrders.stack";

export type CourierTabsParamList = {
  OrdersTab: undefined;
  DeliveriesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<CourierTabsParamList>();

const CourierLayout: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const getTabIcon = useCallback((routeName: keyof CourierTabsParamList) => {
    switch (routeName) {
      case "OrdersTab":
        return "assignment";
      case "DeliveriesTab":
        return "local-shipping";
      case "ProfileTab":
        return "person";
      default:
        return "home";
    }
  }, []);

  const tabScreens: {
    name: keyof CourierTabsParamList;
    component: React.ComponentType<any>;
    title: string;
  }[] = useMemo(
    () => [
      {
        name: "OrdersTab",
        component: CourierOrdersStack,
        title: t("courier.available_orders"),
      },
      {
        name: "DeliveriesTab",
        component: MyDeliveriesPage,
        title: t("courier.my_deliveries"),
      },
      {
        name: "ProfileTab",
        component: ProfileStackNavigator,
        title: t("common.heading.profile.name"),
      },
    ],
    [t]
  );

  // Optional header like in manager layout
  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {user?.first_name} {user?.last_name}
      </Text>
      <MaterialIcons name="logout" size={24} onPress={logout} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name={getTabIcon(route.name)}
                size={size}
                color={color}
              />
            ),
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          {tabScreens.map((screen) => (
            <Tab.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
              options={{ title: screen.title }}
            />
          ))}
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(CourierLayout);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: { fontSize: 18, fontWeight: "600" },
  content: { flex: 1 },
});
