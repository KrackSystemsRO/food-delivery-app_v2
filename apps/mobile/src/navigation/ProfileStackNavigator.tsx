import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/client/Profile";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/HeaderLayout";

export type ProfileStackParamList = {
  Profile: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const { t } = useTranslation();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        headerShown: true,
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t("common.heading.profile.your_profile") }}
      />
    </ProfileStack.Navigator>
  );
}
