import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/client/Profile";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/navigation/common/CommonHeader";
import DeliveryLocationsScreen from "@/screens/client/DeliveryLocations";

export type ProfileStackParamList = {
  Profile: undefined;
  DeliveryLocations: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t("common.heading.profile.your_profile") }}
      />
      <Stack.Screen
        name="DeliveryLocations"
        component={DeliveryLocationsScreen}
        options={{ title: "Manage Delivery Locations" }}
      />
    </Stack.Navigator>
  );
}
