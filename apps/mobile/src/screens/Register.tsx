import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { register as registerUser } from "../services/authentication.service";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/types/navigation.type";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // or from react-native-vector-icons

export default function RegisterScreen() {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError(
        t("register.errors.password_mismatch") || "Passwords do not match"
      );
      setLoading(false);
      return;
    }

    try {
      await registerUser({ email, firstName, lastName, password });
      navigation.navigate("Login");
    } catch (err) {
      setError(
        t("register.errors.failed") || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {t("register.title")}
      </Text>
      <TextInput
        label={t("common.labels.first_name")}
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        label={t("common.labels.last_name")}
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        label={t("common.labels.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label={t("common.labels.password")}
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
        label={t("common.labels.confirm_password") || "Confirm Password"}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
      >
        {t("common.buttons.register.submit")}
      </Button>
      <Button onPress={() => navigation.navigate("Login")} style={styles.link}>
        {t("common.buttons.register.back_to_login")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { marginBottom: 24, textAlign: "center" },
  input: { marginBottom: 12 },
  button: { marginTop: 12 },
  link: { marginTop: 8 },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
});
