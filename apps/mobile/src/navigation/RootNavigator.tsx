import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/authContext";
import LoginScreen from "../screens/Login";
import FadeOutLoading from "../components/animations/FadeOutLoading";
import AuthenticatedLayout from "../components/layouts/AuthenticatedLayout";
import { AppStackParamList } from "../types/navigation.type";
import RegisterScreen from "@/screens/Register";
import RecoverPasswordScreen from "@/screens/RecoverPassword";
import CourierLayout from "@/components/layouts/CourierLayout";
import ManagerLayout from "@/components/layouts/ManagerLayout";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function RootNavigator() {
  const { accessToken, loading, user } = useAuth();
  const [showApp, setShowApp] = useState(false);

  if (loading && !showApp) {
    return (
      <FadeOutLoading loading={loading} onFinish={() => setShowApp(true)} />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {accessToken && user ? (
        user.role === "COURIER" ? (
          <Stack.Screen name="Foodie" component={CourierLayout} />
        ) : user.role === "MANAGER" ? (
          <Stack.Screen name="Foodie" component={ManagerLayout} />
        ) : (
          <Stack.Screen name="Foodie" component={AuthenticatedLayout} />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Recover" component={RecoverPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
