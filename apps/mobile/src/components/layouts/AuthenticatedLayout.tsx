import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import StoresScreen from "../../screens/client/Store";
import StoreDetailsScreen from "../../screens/client/StoreDetails";
import ProductDetailsScreen from "../../screens/client/ProductDetails";
import CartStackNavigator from "@/navigation/CartStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import { useCart } from "@/context/CartContext";
import { AnimatedBadge } from "../animations/BadgeOnUpdate";
import { StoresStackParamList } from "@/types/navigation.type";
import OrdersScreen from "@/screens/client/Orders";

export type BottomTabsParamList = {
  Home: undefined;
  StoresTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
  OrdersTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();
const StoresStack = createNativeStackNavigator<StoresStackParamList>();

export function StoresStackNavigator() {
  return (
    <StoresStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <StoresStack.Screen
        name="Stores"
        component={StoresScreen}
        options={{ title: "Stores" }}
      />
      <StoresStack.Screen name="StoreDetails" component={StoreDetailsScreen} />
      <StoresStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />
    </StoresStack.Navigator>
  );
}

function BottomTabs() {
  const { t } = useTranslation();
  const { state: cartItems } = useCart();

  const totalQuantity = cartItems.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "ProfileTab":
              iconName = "person";
              break;
            case "CartTab":
              iconName = "shopping-cart";
              break;
            case "StoresTab":
              iconName = "store";
              break;
            case "OrdersTab":
              iconName = "receipt-long";
              break;
          }

          return (
            <View>
              <MaterialIcons name={iconName} size={size} color={color} />
              {route.name === "CartTab" && (
                <AnimatedBadge count={totalQuantity} />
              )}
            </View>
          );
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="StoresTab"
        component={StoresStackNavigator}
        options={{ title: t("common.heading.stores.name") }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{ title: t("common.heading.cart.name") }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{ title: t("common.heading.orders.name") }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: t("common.heading.profile.name") }}
      />
    </Tab.Navigator>
  );
}

export default function AuthenticatedLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BottomTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
