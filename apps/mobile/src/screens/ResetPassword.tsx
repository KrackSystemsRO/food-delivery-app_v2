import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/types/navigation.type";
import { resetPassword } from "../services/authentication.service"; // You need to implement this service

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute();
  const { token } = route.params as { token: string }; // token from reset email link

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError(t("resetPassword.error.passwords_do_not_match"));
      return;
    }
    if (password.length < 6) {
      setError(t("resetPassword.error.password_too_short"));
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, new_password: password });
      navigation.navigate("Login");
    } catch (err) {
      setError(t("resetPassword.error.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {t("resetPassword.title")}
      </Text>

      <TextInput
        label={t("common.labels.new_password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        label={t("common.labels.confirm_password")}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirmPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleReset}
        loading={loading}
        style={styles.button}
      >
        {t("common.buttons.resetPassword")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { marginBottom: 24, textAlign: "center" },
  input: { marginBottom: 12 },
  button: { marginTop: 12 },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
});
